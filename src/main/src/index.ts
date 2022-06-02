import { app, session } from 'electron';
import { appId } from '../../../electron-builder.json';
import { appCommandsLine, appIsInstalled } from './app';
import Game from './classes/game';
import { allowedWillNavigateUrls } from './config';
import { createWindow, openUrlExternallyWindow } from './functions/window';
import autoUpdater from './instances/autoupdater';
import log from './instances/log';
import './node';
import './ipc/_ipcs';

log.info(`${app.getName()} is booting up... (mode: ${appIsInstalled ? 'installer' : 'portable'})`);

if (appCommandsLine.length > 0) {
  Game.launchFromCommandsLine(appCommandsLine);
  app.quit();
}

if (!app.requestSingleInstanceLock()) {
  log.error('Only one instance is allowed.');
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

    openUrlExternallyWindow(url);
  });

  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#14-disable-or-limit-creation-of-new-windows
  webContents.setWindowOpenHandler(({ url }) => {
    openUrlExternallyWindow(url);

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
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    log.debug(`${permission} permission is not granted.`);

    callback(false);
  });

  await createWindow();
});
