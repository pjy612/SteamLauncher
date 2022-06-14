import glob from 'fast-glob';
import appNotify from '../functions/app-notify';
import appSpawn from '../functions/app-spawn';
import logger from '../instances/logger';
import paths from '../configs/paths';
// eslint-disable-next-line import/no-cycle
import SteamGame from './steam-game';

class SteamCloud {
  private static invokeLudusavi(commandsLine: string[]) {
    try {
      const spawn = appSpawn(paths.ludusavi.filePath, commandsLine, paths.ludusavi.rootPath);
      const parse = JSON.parse(spawn.stdout) as Record<
        string,
        Record<string, undefined | string | Record<string, string>>
      >;
      return !(
        typeof parse.errors !== 'undefined' &&
        typeof parse.errors.unknownGames !== 'undefined' &&
        parse.errors.unknownGames.length > 0
      );
    } catch {
      return false;
    }
  }

  private static checkIfGameSaveToRemote(appId: string) {
    const data = SteamGame.getData(appId);
    return typeof data !== 'undefined'
      ? glob.sync('*', { cwd: data.paths.savesRemoteRootPath, onlyFiles: true }).length > 0
      : false;
  }

  public static backup(dataGame: StoreGameDataType) {
    const appId = dataGame.appId;
    const appIdName = dataGame.name;
    const loggerHeader = 'SteamCloud Backup:';

    if (SteamCloud.checkIfGameSaveToRemote(appId)) {
      logger.info(`${loggerHeader} I don't initialize the backup because the saves are saved in the emulator folder.`);
      return;
    }

    let ludusaviResponse = false;
    const ludusaviCommandsLine = ['backup', '--merge', '--try-update', '--api', `--path`, paths.cloud.rootPath];

    logger.info(`${loggerHeader} Initializing backup for ${appIdName}`);
    logger.info(`${loggerHeader} I try to search by appId ${appId}...`);
    ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, '--by-steam-id', appId]);
    if (!ludusaviResponse) {
      logger.info(`${loggerHeader} I try to search by appIdName ${appIdName}...`);
      ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, appIdName]);
    }

    if (ludusaviResponse) {
      const ok = `${loggerHeader} The backups of the saves were successful.`;
      logger.info(ok);
      appNotify(ok);
    } else {
      const notOk = `${loggerHeader} The backup of the saves was not successful.`;
      logger.info(notOk);
      appNotify(notOk);
    }
  }

  public static restore(dataGame: StoreGameDataType) {
    const appId = dataGame.appId;
    const appIdName = dataGame.name;
    const loggerHeader = 'SteamCloud Restore:';

    if (SteamCloud.checkIfGameSaveToRemote(appId)) {
      logger.info(`${loggerHeader} I don't initialize the restore because the saves are saved in the emulator folder.`);
      return;
    }

    let ludusaviResponse = false;
    const ludusaviCommandsLine = ['restore', '--force', '--api', `--path`, paths.cloud.rootPath];

    logger.info(`${loggerHeader} Initializing restore for ${appIdName}`);
    logger.info(`${loggerHeader} I try to search by appId ${appId}...`);
    ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, '--by-steam-id', appId]);
    if (!ludusaviResponse) {
      logger.info(`${loggerHeader} I try to search by appIdName ${appIdName}...`);
      ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, appIdName]);
    }

    if (ludusaviResponse) {
      const ok = `${loggerHeader} The restore of the saves were successful.`;
      logger.info(ok);
      appNotify(ok);
    } else {
      const notOk = `${loggerHeader} The restore of the saves was not successful.`;
      logger.info(notOk);
      appNotify(notOk);
    }
  }
}

export default SteamCloud;
