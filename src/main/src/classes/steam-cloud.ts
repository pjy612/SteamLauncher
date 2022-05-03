import type { ChildProcess } from 'node:child_process';
import { pathExists } from 'fs-extra';
import notify from '../functions/notify';
import log from '../instances/log';
import execFile from '../node/exec-file-promisify';
import paths from '../paths';
// eslint-disable-next-line import/no-cycle
import Game from './game';

class SteamCloud {
  public static async backup(dataGame: StoreGameDataType, byAppId = true) {
    const appId = dataGame.appId;
    const appIdName = Game.removeSpecialChars(dataGame.name);

    log.info(
      `SteamCloud Backup: Initializing backup for ${appIdName} (search by ${
        byAppId ? `appid ${appId}` : `name ${appIdName}`
      })...`
    );

    const exe = paths.files.ludusaviFilePath;
    const gamePaths = Game.paths(appId);
    try {
      const spawnCommandLine = ['backup', '--force', `--path`, gamePaths.appIdSavesCloudPath];
      const spawn = await execFile(
        exe,
        byAppId ? [...spawnCommandLine, '--by-steam-id', appId] : [...spawnCommandLine, appIdName]
      );
      log.debug(`SteamCloud Backup: \n${spawn.stdout}`);
      notify('SteamCloud Backup: The backups of the saves were successful.');
      return true;
    } catch (error) {
      if (byAppId) {
        await SteamCloud.backup(dataGame, false);
      }

      const { stderr } = error as ChildProcess;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log.error(`SteamCloud Backup: ${stderr}`);
      notify('SteamCloud Backup: The backup of the saves was not successful, check the logs.');
      return false;
    }
  }

  public static async restore(dataGame: StoreGameDataType, byAppId = true) {
    const appId = dataGame.appId;
    const appIdName = Game.removeSpecialChars(dataGame.name);

    log.info(
      `SteamCloud Restore: Initializing restore for ${appIdName} (search by ${
        byAppId ? `appid ${appId}` : `name ${appIdName}`
      })...`
    );

    const exe = paths.files.ludusaviFilePath;
    const gamePaths = Game.paths(appId);
    try {
      if (await pathExists(gamePaths.appIdSavesCloudPath)) {
        const spawnCommandLine = ['restore', '--force', `--path`, gamePaths.appIdSavesCloudPath];
        const spawn = await execFile(
          exe,
          byAppId ? [...spawnCommandLine, '--by-steam-id', appId] : [...spawnCommandLine, appIdName]
        );
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
      if (byAppId) {
        await SteamCloud.restore(dataGame, false);
      }

      const { stderr } = error as ChildProcess;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log.error(`SteamCloud Restore: ${stderr}`);
      notify('SteamCloud Restore: The restore of the saves was not successful, check the logs.');
      return false;
    }
  }
}

export default SteamCloud;
