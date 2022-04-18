import { app, session, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import { appId } from '../../../electron-builder.json';
import Game from './classes/game';
import { allowedWillNavigateUrls } from './config';
import { appCommandsLine } from './environments';
import appIsInstalled from './functions/app-is-installed';
import createWindow from './functions/create-window';
import openUrlExternally from './functions/open-url-externally';
import log from './instances/log';
import storage from './instances/storage';
import './node';
import './ipc/_ipcs';

log.info(
  `App starting... (portable: ${appIsInstalled ? 'false' : 'true'}; autoUpdater: ${
    appIsInstalled ? 'true' : 'false'
  };)`
);

autoUpdater.logger = log;

if (!app.requestSingleInstanceLock() && appCommandsLine.length === 0) {
  log.error('Only single instances are allowed');
  app.quit();
}

app.setAppUserModelId(appId);
app.disableHardwareAcceleration();
// SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#4-enable-sandboxing
app.enableSandbox();

app.on('web-contents-created', (_event, contents) => {
  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#13-disable-or-limit-navigation
  contents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url);
    if (!allowedWillNavigateUrls.has(parsedUrl.origin)) {
      log.debug(`will-navigate: ${parsedUrl.href} isn't allowed`);
      event.preventDefault();
    }

    openUrlExternally(url);
  });

  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#14-disable-or-limit-creation-of-new-windows
  // NOTE: this happen when link have target="_blank"
  contents.setWindowOpenHandler(({ url }) => {
    openUrlExternally(url);
    return {
      action: 'deny',
    };
  });
});

app.on('second-instance', () => {
  app.focus();
});

app
  .whenReady()
  .then(async () => {
    // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#5-handle-session-permission-requests-from-remote-content
    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
      log.debug(`${permission} permission is not granted.`);
      // eslint-disable-next-line promise/no-callback-in-promise
      callback(false);
    });

    if (appCommandsLine.length > 0) {
      const { 0: argumentAppId } = appCommandsLine;
      const data: StoreGameDataType = storage.get(`games.${argumentAppId}`);
      if (typeof data !== 'undefined') {
        await Game.launch(data);
      } else {
        dialog.showErrorBox('Error', `${argumentAppId} does not exist!`);
      }

      app.exit();
    }

    if (appIsInstalled) {
      void autoUpdater.checkForUpdatesAndNotify();
    }

    await createWindow();
  })
  .catch((error) => {
    log.error((error as Error).message);
  });
