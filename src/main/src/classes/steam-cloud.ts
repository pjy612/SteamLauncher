import type { ChildProcess } from 'node:child_process';
import { pathExists } from 'fs-extra';
import notify from '../functions/notify';
import log from '../instances/log';
import execFile from '../node/exec-file-promisify';
import paths from '../paths';
// eslint-disable-next-line import/no-cycle
import Game from './game';

class SteamCloud {
  public static async backup(name: string) {
    const nname = Game.removeSpecialChars(name);

    log.info(`SteamCloud Backup: Initializing backup for ${nname}...`);

    const exe = paths.files.ludusaviFilePath;
    const gamePaths = Game.paths(nname);
    try {
      const spawn = await execFile(exe, [
        'backup',
        '--force',
        `--path`,
        gamePaths.appIdSavesCloudPath,
        nname,
      ]);
      log.debug(`SteamCloud Backup: \n${spawn.stdout}`);
      notify('SteamCloud Backup: The backups of the saves were successful.');
      return true;
    } catch (error) {
      const { stderr } = error as ChildProcess;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log.error(`SteamCloud Backup: ${stderr}`);
      notify('SteamCloud Backup: The backup of the saves was not successful, check the logs.');
      return false;
    }
  }

  public static async restore(name: string) {
    const nname = Game.removeSpecialChars(name);

    log.info(`SteamCloud Restore: Initializing restore for ${nname}...`);

    const exe = paths.files.ludusaviFilePath;
    const gamePaths = Game.paths(nname);
    try {
      if (await pathExists(gamePaths.appIdSavesCloudPath)) {
        const spawn = await execFile(exe, [
          'restore',
          '--force',
          `--path`,
          gamePaths.appIdSavesCloudPath,
          nname,
        ]);
        log.debug(`SteamCloud Restore: \n${spawn.stdout}`);
        notify('SteamCloud Restore: The restore of the saves were successful.');
      } else {
        log.debug('SteamCloud Restore: The game does not contain any save backups.');
        notify(
          'SteamCloud Restore: The restore of the saves was not successful, the game does not contain any save backups.'
        );
      }
      return true;
    } catch (error) {
      const { stderr } = error as ChildProcess;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log.error(`SteamCloud Restore: ${stderr}`);
      notify('SteamCloud Restore: The restore of the saves was not successful, check the logs.');
      return false;
    }
  }
}

export default SteamCloud;
