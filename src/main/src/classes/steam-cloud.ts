import type { ChildProcess } from 'node:child_process';
import notify from '../functions/notify';
import log from '../instances/log';
import execFile from '../node/exec-file-promisify';
import paths from '../paths';
import Game from './game';

class SteamCloud {
  public static async backupByAppId(appId: string) {
    log.info(`SteamCloud backupByAppId: Initializing backup for ${appId}...`);

    const exe = paths.files.ludusaviFile;
    const gamePaths = Game.paths(appId);
    try {
      const spawn = await execFile(exe, [
        'backup',
        '--by-steam-id',
        '--force',
        `--path`,
        gamePaths.appIdSavesCloudPath,
        appId,
      ]);
      log.debug(`SteamCloud backupByAppId: \n${spawn.stdout}`);
      notify('The backups of the saves were successful.');
      return true;
    } catch (error) {
      const { stderr } = error as ChildProcess;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log.error(`SteamCloud backupByAppId: ${stderr}`);
      notify('The backup of the saves was not successful. Check the logs.');
      return false;
    }
  }

  public static async restoreByAppId(appId: string) {
    log.info(`SteamCloud restoreByAppId: Initializing restore for ${appId}...`);

    const exe = paths.files.ludusaviFile;
    const gamePaths = Game.paths(appId);
    try {
      const spawn = await execFile(exe, [
        'restore',
        '--by-steam-id',
        '--force',
        `--path`,
        gamePaths.appIdSavesCloudPath,
        appId,
      ]);
      log.debug(`SteamCloud restoreByAppId: \n${spawn.stdout}`);
      notify('The restore of the saves were successful.');
      return true;
    } catch (error) {
      const { stderr } = error as ChildProcess;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log.error(`SteamCloud restoreByAppId: ${stderr}`);
      notify('The restore of the saves was not successful. Check the logs.');
      return false;
    }
  }
}

export default SteamCloud;
