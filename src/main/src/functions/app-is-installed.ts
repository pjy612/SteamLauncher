import { join, resolve } from 'node:path';
import { app } from 'electron';
import { pathExistsSync } from 'fs-extra';
import { appIsDevelopment } from '../environments';

// NOTE: copied to avoid the dependency cycle
const appRootPath = appIsDevelopment ? app.getAppPath() : resolve(app.getAppPath(), '../../');
// TODO: It's the only way i've found to check if the app is portable or installed.
const appIsInstalled = pathExistsSync(join(appRootPath, 'Uninstall SteamLauncher.exe'));

export default appIsInstalled;
