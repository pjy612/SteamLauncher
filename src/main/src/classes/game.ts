import { join, basename } from 'node:path';
import { app, shell, webContents } from 'electron';
import { pathExists, emptyDir, copy, writeFile, ensureDir } from 'fs-extra';
import ini from 'ini';
import notify from '../functions/notify';
import storage from '../instances/storage';
import execFile from '../node/exec-file-promisify';
import paths from '../paths';
import MrGoldBergEmulator from './mr-goldberg-emulator';
import SteamCloud from './steam-cloud';

class Game {
  public static async launch(dataGame: StoreGameDataType, withoutEmu = false) {
    const dataAccount = storage.get('account')!;
    const dataGamePath = dataGame.path;
    const dataGameRunPath = dataGame.runPath;
    const dataGameCommandLine = dataGame.commandLine;
    const dataGamePaths = Game.paths(dataGame.appId);

    const dataSettings = storage.get('settings');
    const dataNetwork = dataSettings.network;

    if (withoutEmu) {
      notify(`Launch normally ${dataGame.name}`);
      await execFile(dataGamePath, dataGameCommandLine.split(' '));
      return;
    }

    if (!(await MrGoldBergEmulator.checkForUpdatesAndNotify())) {
      notify('Error with the verification of the emulator, check the logs.');
      return;
    }

    // steam_saves
    await writeFile(paths.emulator.localSaveFilePath, 'steam_saves');

    await ensureDir(paths.emulator.savesPath);

    // steam_saves/settings
    await ensureDir(paths.emulator.savesSettingsPath);

    await writeFile(paths.emulator.savesSettingsAccountNameFilePath, dataAccount.name);
    await writeFile(paths.emulator.savesSettingsLanguageFilePath, dataAccount.language);
    await writeFile(paths.emulator.savesSettingsListenPortFilePath, dataAccount.listenPort);
    await writeFile(paths.emulator.savesSettingsUserSteamIdFilePath, dataAccount.steamId);

    // steam_settings
    await emptyDir(paths.emulator.settingsPath);

    await copy(dataGamePaths.appIdDataPath, paths.emulator.settingsPath, {
      filter: (source) => {
        return basename(source) !== 'header.jpg';
      },
    });

    // steam_settings/disable_overlay.txt
    if (!dataGame.overlay) {
      await writeFile(paths.emulator.settingsDisableOverlayFilePath, '');
    }

    // steam_settings/disable_networking.txt
    if (!dataNetwork) {
      await writeFile(paths.emulator.settingsDisableNetworkingFilePath, '');
    }

    // steam_settings/offline.txt
    if (!dataNetwork) {
      await writeFile(paths.emulator.settingsOfflineFilePath, '');
    }

    // loader
    const loaderConfig = {
      SteamClient: {
        AppId: dataGame.appId,
        Exe: dataGamePath,
        ExeCommandLine: dataGameCommandLine,
        ExeRunDir: dataGameRunPath,
        SteamClient64Dll: paths.emulator.steamClient64FilePath,
        SteamClientDll: paths.emulator.steamClientFilePath,
      },
    };

    await writeFile(paths.emulator.loaderConfigFilePath, ini.stringify(loaderConfig));

    // exec
    notify(`Launch ${dataGame.name}`);

    await execFile(paths.emulator.loaderPath);

    // after the game is closed, I make backups of the saves
    await SteamCloud.backupByAppId(dataGame.appId);
  }

  public static remove(appId: string) {
    const data = storage.get('games');
    if (typeof data !== 'undefined') {
      const { name } = data[appId];
      delete data[appId];
      storage.set('games', data);
      notify(`${name} removed successfully!`);
      webContents.getFocusedWebContents().send('index-reload-games-list');
    }
  }

  public static paths(appId: string) {
    const steamRetrieverPath = join(paths.appDataPath, 'steam_retriever');
    const steamCloudPath = join(paths.appDataPath, 'steam_cloud');
    const appIdSavesCloudPath = join(steamCloudPath, appId);
    const appIdDataPath = join(steamRetrieverPath, appId);
    const appIdAchievementsPath = join(appIdDataPath, 'achievements');
    const appIdAchievementsInfoPath = join(appIdDataPath, 'achievements.json');
    const appIdStatsInfoPath = join(appIdDataPath, 'stats.txt');
    const appIdItemsInfoPath = join(appIdDataPath, 'items.json');
    const appIdDefaultItemsInfoPath = join(appIdDataPath, 'default_items.json');
    const appIdDlcsInfoPath = join(appIdDataPath, 'DLC.txt');
    const appIdSteamInterfacesPath = join(appIdDataPath, 'steam_interfaces.txt');
    const appIdHeaderPath = join(appIdDataPath, 'header.jpg');
    const appIdSavesPath = join(paths.emulator.savesPath, appId);

    return {
      steamRetrieverPath,
      appIdSavesPath,
      appIdAchievementsInfoPath,
      appIdAchievementsPath,
      appIdDataPath,
      appIdDefaultItemsInfoPath,
      appIdDlcsInfoPath,
      appIdHeaderPath,
      appIdItemsInfoPath,
      appIdStatsInfoPath,
      appIdSteamInterfacesPath,
      appIdSavesCloudPath,
    };
  }

  public static async openFileLocation(appId: string) {
    const dataGame: StoreGameDataType = storage.get(`games.${appId}`);
    if (await pathExists(dataGame.path)) {
      shell.showItemInFolder(dataGame.path);
    } else {
      notify('The game path does not exists!');
    }
  }

  public static async openSaveLocation(appId: string) {
    const gamePaths = Game.paths(appId);
    const savesPath = gamePaths.appIdSavesPath;
    const savesCloudPath = gamePaths.appIdSavesCloudPath;
    if (await pathExists(savesPath)) {
      await shell.openPath(savesPath);
    } else {
      notify('The game has no saves inside the emulator. Try in cloud saves...');

      if (await pathExists(savesCloudPath)) {
        await shell.openPath(savesCloudPath);
      } else {
        notify('The game has no saves inside the cloud saves.');
      }
    }
  }

  public static async openDataLocation(appId: string) {
    const appDataPath = Game.paths(appId).appIdDataPath;
    if (await pathExists(appDataPath)) {
      await shell.openPath(appDataPath);
    } else {
      notify('The game data does not exists!');
    }
  }

  public static createDesktopShortcut(appId: string) {
    const data: StoreGameDataType = storage.get(`games.${appId}`);
    const name = data.name.replace(/[^\w\s]/gu, '');
    const toPath = join(app.getPath('desktop'), `Launch ${name}.lnk`);
    const writeShortcutLink = shell.writeShortcutLink(toPath, {
      args: data.appId,
      icon: data.path,
      iconIndex: 0,
      target: app.getPath('exe'),
    });
    if (writeShortcutLink) {
      notify('Shortcut created successfully on desktop!');
    } else {
      notify('Unknown error with creating shortcut!');
    }
  }
}

export default Game;
