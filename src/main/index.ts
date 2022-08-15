import { app, session, Notification, nativeTheme } from 'electron';
import { appId } from '@/electron-builder.json';
import { appIsInstalled, appIsOnline, appLaunchGameMode } from './app';
import SteamGame from './classes/steam-game';
import allowedWillNavigateUrls from './configs/allowed-will-navigate-urls';
import appCreateWindow from './functions/app-create-window';
import appOpenUrl from './functions/app-open-url';
import appShowErrorBox from './functions/app-show-error-box';
import appNotify from './functions/app-notify';
import logger from './instances/logger';
import './node';
import './ipc/_ipcs';

app.setAppUserModelId(appId);

if (!app.requestSingleInstanceLock() && !appLaunchGameMode) {
  appNotify(`${app.getName()} is already running.`);
  app.quit();
}

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
  nativeTheme.themeSource = 'dark';

  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#5-handle-session-permission-requests-from-remote-content
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  const isOnline = await appIsOnline();

  logger.info(undefined, `${app.getName()} is booting up... `);
  logger.debug(
    undefined,
    `mode: ${
      appIsInstalled ? 'installer' : 'portable'
    }; notifications: ${Notification.isSupported().toString()}; online: ${isOnline.toString()}`
  );

  if (appLaunchGameMode) {
    await SteamGame.launchFromAppCommandsLine();
  } else {
    if (!isOnline) {
      appShowErrorBox(`${app.getName()} requires internet access, without it does not work properly.`);
      return;
    }
    await appCreateWindow();
  }
});
