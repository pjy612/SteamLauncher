import { autoUpdater } from 'electron-updater';
import logger from './logger';

autoUpdater.logger = logger;

export default autoUpdater;
