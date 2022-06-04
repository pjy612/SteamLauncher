import https from 'node:https';
import process from 'node:process';
import log from './instances/log';
import storage from './instances/storage';

process.on('uncaughtException', (error) => {
  log.error(error.message);
});

https.globalAgent.options.rejectUnauthorized = storage.get('settings.httpsRejectUnauthorized');
