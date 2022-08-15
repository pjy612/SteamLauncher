import https from 'node:https';
import process from 'node:process';
import util from 'node:util';
import storageDefaults from './configs/storage-defaults';
import appShowErrorBox from './functions/app-show-error-box';
import logger from './instances/logger';
import storage from './instances/storage';

process.on('unhandledRejection', (reason, promise) => {
  const content = util.format('Unhandled Rejection at:', promise, 'Reason:', reason);
  logger.error(undefined, content);
  appShowErrorBox(content);
});

process.on('uncaughtException', (error, origin) => {
  const content = util.format('Uncaught Exception at:', error, 'Origin:', origin);
  logger.error(undefined, content);
  appShowErrorBox(content);
});

https.globalAgent.options.rejectUnauthorized = storage.get(
  'settings.httpsRejectUnauthorized',
  storageDefaults.settings.httpsRejectUnauthorized
);
