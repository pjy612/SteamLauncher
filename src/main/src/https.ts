import https from 'node:https';
import ca from './ca-bundle/ca_intermediate_root_bundle.pem?raw';

https.globalAgent.options.ca = ca;
