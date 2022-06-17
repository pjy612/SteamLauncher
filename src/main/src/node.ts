import { app, dialog } from 'electron';
import https from 'node:https';
import process from 'node:process';
import util from 'node:util';
import logger from './instances/logger';
import storage from './instances/storage';

process.on('unhandledRejection', (reason, promise) => {
  const content = util.format('Unhandled Rejection at:', promise, 'Reason:', reason);
  logger.error(content);
  dialog.showErrorBox(app.getName(), content);
});

process.on('uncaughtException', (error, origin) => {
  const content = util.format('Uncaught Exception at:', error, 'Origin:', origin);
  logger.error(content);
  dialog.showErrorBox(app.getName(), content);
});

https.globalAgent.options.rejectUnauthorized = storage.get('settings.httpsRejectUnauthorized', true);
