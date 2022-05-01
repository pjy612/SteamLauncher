import { app } from 'electron';
import { resolve } from 'node:path';

const appRootPath = import.meta.env.DEV ? app.getAppPath() : resolve(app.getAppPath(), '../../');

export default appRootPath;
