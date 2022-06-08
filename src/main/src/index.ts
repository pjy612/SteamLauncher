import { app, session, Notification } from 'electron';
import { appId } from '../../../electron-builder.json';
import { appCommandsLine, appIsInstalled } from './app';
import SteamGame from './classes/steam-game';
import allowedWillNavigateUrls from './configs/allowed-will-navigate-urls';
import { createWindow, appOpenUrl } from './functions/app-window';
import autoUpdater from './instances/autoupdater';
import logger from './instances/logger';
import './node';
import './ipc/_ipcs';

logger.info(
  `${app.getName()} is booting up... (mode: ${
    appIsInstalled ? 'installer' : 'portable'
  }, notifications: ${Notification.isSupported().toString()})`
);

if (appCommandsLine.length > 0) {
  SteamGame.launchFromAppCommandsLine(appCommandsLine);
  app.quit();
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

if (appIsInstalled) {
  void autoUpdater.checkForUpdatesAndNotify();
}

app.setAppUserModelId(appId);
// app.disableHardwareAcceleration();
// SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#4-enable-sandboxing
app.enableSandbox();

app.on('web-contents-created', (_event, webContents) => {
  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#13-disable-or-limit-navigation
  webContents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url);

    if (!allowedWillNavigateUrls.has(parsedUrl.hostname)) {
      event.preventDefault();
    }

    appOpenUrl(url);
  });

  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#14-disable-or-limit-creation-of-new-windows
  webContents.setWindowOpenHandler(({ url }) => {
    appOpenUrl(url);

    return {
      action: 'deny',
    };
  });
});

app.on('second-instance', () => {
  app.focus();
});

app.on('ready', async () => {
  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#5-handle-session-permission-requests-from-remote-content
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  await createWindow();
});
