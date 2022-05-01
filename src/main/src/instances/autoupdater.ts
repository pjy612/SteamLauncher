import { autoUpdater } from 'electron-updater';
import log from './log';

autoUpdater.logger = log;

export default autoUpdater;
