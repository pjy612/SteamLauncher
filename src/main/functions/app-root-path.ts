import { app } from 'electron';
import { resolve } from 'node:path';

const appRootPath = app.isPackaged ? resolve(app.getAppPath(), '../../') : app.getAppPath();

export default appRootPath;
