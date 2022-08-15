import glob from 'fast-glob';
import appNotify from '../functions/app-notify';
import appSpawn from '../functions/app-spawn';
import logger from '../instances/logger';
import paths from '../configs/paths';

class SteamCloud {
  private static invokeLudusavi(commandsLine: string[]) {
    try {
      const loggerHeader = 'SteamCloud invokeLudusavi';
      const spawn = appSpawn(paths.ludusavi.filePath, commandsLine, paths.ludusavi.rootPath);
      const parse = JSON.parse(spawn.stdout) as LudusaviType;

      if (typeof parse.errors !== 'undefined') {
        if (typeof parse.errors.unknownGames !== 'undefined') {
          logger.debug(loggerHeader, 'unknownGames', parse.errors.unknownGames);
          return false;
        }

        if (typeof parse.errors.someGamesFailed !== 'undefined') {
          logger.debug(loggerHeader, 'someGamesFailed', parse.errors.someGamesFailed);
          return false;
        }
      }

      if (parse.overall.processedGames === 0) {
        logger.debug(loggerHeader, 'processedGames', parse.overall.processedGames);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  private static async checkIfGameSaveToRemote(dataGame: StoreGameDataType) {
    const files = await glob('*', { cwd: dataGame.paths.savesRemoteRootPath, onlyFiles: true });
    return files.length > 0;
  }

  public static async backup(dataGame: StoreGameDataType) {
    const loggerHeader = 'SteamCloud Backup';

    if (await SteamCloud.checkIfGameSaveToRemote(dataGame)) {
      logger.info(loggerHeader, "I don't initialize the backup because the saves are saved in the emulator folder.");
      return;
    }

    const dataGameAppId = dataGame.appId;
    const dataGameName = dataGame.name;
    const dataGamePCGamingWikiName = dataGame.pcGamingWikiName;

    let ludusaviResponse = false;
    const ludusaviCommandsLine = ['backup', '--merge', '--try-update', '--api', '--path', paths.cloud.rootPath];

    logger.info(loggerHeader, `Initializing backup for ${dataGameName}`);

    logger.info(loggerHeader, `I try to search by appId ${dataGameAppId}...`);
    ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, '--by-steam-id', dataGameAppId]);
    if (!ludusaviResponse) {
      logger.info(loggerHeader, `I try to search by appIdName ${dataGameName}...`);
      ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, dataGameName]);
    }
    if (!ludusaviResponse) {
      if (typeof dataGamePCGamingWikiName !== 'undefined' && dataGamePCGamingWikiName.length > 0) {
        logger.info(loggerHeader, `I try to search by PCGamingWikiName ${dataGamePCGamingWikiName}...`);
        ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, dataGamePCGamingWikiName]);
      } else {
        logger.info(loggerHeader, 'Could not search by PCGamingWikiName, because it has no name...');
      }
    }

    if (ludusaviResponse) {
      const ok = 'The backups of the saves were successful.';
      logger.info(loggerHeader, ok);
      appNotify(ok);
    } else {
      const notOk = 'The backup of the saves was not successful.';
      logger.error(loggerHeader, notOk);
      appNotify(notOk);
    }
  }

  public static async restore(dataGame: StoreGameDataType) {
    const loggerHeader = 'SteamCloud Restore';

    if (await SteamCloud.checkIfGameSaveToRemote(dataGame)) {
      logger.info(loggerHeader, "I don't initialize the restore because the saves are saved in the emulator folder.");
      return;
    }

    const dataGameName = dataGame.name;
    const dataGamePCGamingWikiName = dataGame.pcGamingWikiName;

    let ludusaviResponse = false;
    const ludusaviCommandsLine = ['restore', '--force', '--api', '--path', paths.cloud.rootPath];

    logger.info(loggerHeader, `Initializing restore for ${dataGameName}`);

    // NOTE: ludusavi has a bug that does not allow restore by steam appid
    // logger.info(loggerHeader, `I try to search by appId ${appId}...`)
    // ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, '--by-steam-id', appId])
    logger.info(loggerHeader, `I try to search by appIdName ${dataGameName}...`);
    ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, dataGameName]);
    if (!ludusaviResponse) {
      if (typeof dataGamePCGamingWikiName !== 'undefined' && dataGamePCGamingWikiName.length > 0) {
        logger.info(loggerHeader, `I try to search by PCGamingWikiName ${dataGamePCGamingWikiName}...`);
        ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, dataGamePCGamingWikiName]);
      } else {
        logger.info(loggerHeader, 'Could not search by PCGamingWikiName, because it has no name...');
      }
    }

    if (ludusaviResponse) {
      const ok = 'The restore of the saves were successful.';
      logger.info(loggerHeader, ok);
      appNotify(ok);
    } else {
      const notOk = 'The restore of the saves was not successful.';
      logger.error(loggerHeader, notOk);
      appNotify(notOk);
    }
  }
}

export default SteamCloud;
