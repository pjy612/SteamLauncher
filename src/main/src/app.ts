import { app } from 'electron';
import { join } from 'node:path';
import { argv as appProcessArgv } from 'node:process';
import { pathExistsSync } from 'fs-extra';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import appRootPath from './functions/app-root-path';

// NOTE: without parseSync i get type error
// eslint-disable-next-line node/no-sync
export const appCommandsLine = yargs(hideBin(appProcessArgv)).parseSync();

/*
  NOTE: It's the only way i've found to check if the app is portable or installed.
  TODO: windows registry
 */
export const appIsInstalled = app.isPackaged && pathExistsSync(join(appRootPath, `Uninstall ${app.getName()}.exe`));
