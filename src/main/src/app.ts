import { app } from 'electron';
import { join } from 'node:path';
import { argv } from 'node:process';
import { pathExistsSync } from 'fs-extra';
import appRootPath from './functions/app-root-path';

export const appCommandsLine = argv.slice(app.isPackaged ? 1 : 2);

/*
  NOTE: It's the only way i've found to check if the app is portable or installed.
  TODO: windows registry
 */
export const appIsInstalled = app.isPackaged && pathExistsSync(join(appRootPath, `Uninstall ${app.getName()}.exe`));
