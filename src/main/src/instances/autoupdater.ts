import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import appPromptYesNo from '../functions/app-prompt-yes-no';
import logger from './logger';

autoUpdater.logger = logger;
autoUpdater.autoDownload = false;

autoUpdater.on('update-available', async (info) => {
  if (await appPromptYesNo(`${app.getName()} v${info.version} has been released! Do you want to update now?`, 'info')) {
    await autoUpdater.downloadUpdate();
  }
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});

export default autoUpdater;
