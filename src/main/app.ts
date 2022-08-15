import { app } from 'electron';
import dns from 'node:dns';
import util from 'node:util';
import { join } from 'node:path';
import { argv as appProcessArgv } from 'node:process';
import { pathExistsSync } from 'fs-extra';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import appRootPath from './functions/app-root-path';

export const appCommandsLine = yargs(hideBin(appProcessArgv)).parseSync();

export const appLaunchGameMode = typeof appCommandsLine.appid !== 'undefined';

export const appIsOnline = async () => {
  const dnsLookup = util.promisify(dns.lookup);
  try {
    await dnsLookup('google.com');
    return true;
  } catch {
    return false;
  }
};

export const appIsInstalled = app.isPackaged && pathExistsSync(join(appRootPath, `Uninstall ${app.getName()}.exe`));
