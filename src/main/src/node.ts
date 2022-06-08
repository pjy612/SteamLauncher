import https from 'node:https';
import process from 'node:process';
import util from 'node:util';
import logger from './instances/logger';
import storage from './instances/storage';

process.on('unhandledRejection', (reason: Error, promise) => {
  logger.error(util.format('Unhandled Rejection at:', promise, 'Reason:', reason));
});

process.on('uncaughtException', (error, origin) => {
  logger.error(util.format('Uncaught Exception at:', error, 'Origin:', origin));
});

https.globalAgent.options.rejectUnauthorized = storage.get('settings.httpsRejectUnauthorized', true);
