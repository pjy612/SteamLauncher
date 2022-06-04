import glob from 'fast-glob';
import appNotify from '../functions/app-notify';
import appSpawn from '../functions/app-spawn';
import log from '../instances/log';
import paths from '../configs/paths';
// eslint-disable-next-line import/no-cycle
import SteamGame from './steam-game';

class SteamCloud {
  private static invokeLudusavi(commandsLine: string[]) {
    try {
      const spawn = appSpawn(paths.ludusavi.filePath, commandsLine, paths.ludusavi.rootPath);
      const parse = JSON.parse(spawn.stdout) as Record<string, unknown>;
      return !(
        typeof parse.errors !== 'undefined' &&
        typeof (parse.errors as Record<string, string>).unknownGames !== 'undefined' &&
        (parse.errors as Record<string, string>).unknownGames.length > 0
      );
    } catch {
      return false;
    }
  }

  private static checkIfGameSaveToRemote(appId: string) {
    const { appIdSavesRemotePath } = SteamGame.paths(appId);
    return glob.sync('*', { cwd: appIdSavesRemotePath, onlyFiles: true }).length > 0;
  }

  public static backup(dataGame: StoreGameDataType) {
    const appId = dataGame.appId;
    const appIdName = dataGame.name;
    const logHeader = 'SteamCloud Backup:';

    if (SteamCloud.checkIfGameSaveToRemote(appId)) {
      log.info(`${logHeader} I don't initialize the backup because the saves are saved in the emulator folder.`);
      return;
    }

    let ludusaviResponse = false;
    const ludusaviCommandsLine = ['backup', '--merge', '--try-update', '--api', `--path`, paths.cloud.rootPath];

    log.info(`${logHeader} Initializing backup for ${appIdName}`);
    log.info(`${logHeader} I try to search by appId ${appId}...`);
    ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, '--by-steam-id', appId]);
    if (!ludusaviResponse) {
      log.info(`${logHeader} I try to search by appIdName ${appIdName}...`);
      ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, appIdName]);
    }

    if (ludusaviResponse) {
      const ok = `${logHeader} The backups of the saves were successful.`;
      log.info(ok);
      appNotify(ok);
    } else {
      const notOk = `${logHeader} The backup of the saves was not successful.`;
      log.info(notOk);
      appNotify(notOk);
    }
  }

  public static restore(dataGame: StoreGameDataType) {
    const appId = dataGame.appId;
    const appIdName = dataGame.name;
    const logHeader = 'SteamCloud Restore:';

    if (SteamCloud.checkIfGameSaveToRemote(appId)) {
      log.info(`${logHeader} I don't initialize the restore because the saves are saved in the emulator folder.`);
      return;
    }

    let ludusaviResponse = false;
    const ludusaviCommandsLine = ['restore', '--force', '--api', `--path`, paths.cloud.rootPath];

    log.info(`${logHeader} Initializing restore for ${appIdName}`);
    log.info(`${logHeader} I try to search by appId ${appId}...`);
    ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, '--by-steam-id', appId]);
    if (!ludusaviResponse) {
      log.info(`${logHeader} I try to search by appIdName ${appIdName}...`);
      ludusaviResponse = SteamCloud.invokeLudusavi([...ludusaviCommandsLine, appIdName]);
    }

    if (ludusaviResponse) {
      const ok = `${logHeader} The restore of the saves were successful.`;
      log.info(ok);
      appNotify(ok);
    } else {
      const notOk = `${logHeader} The restore of the saves was not successful.`;
      log.info(notOk);
      appNotify(notOk);
    }
  }
}

export default SteamCloud;
