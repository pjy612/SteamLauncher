import https from 'node:https';
import storage from './storage';

https.globalAgent.options.rejectUnauthorized = storage.get('settings.httpsRejectUnauthorized');
