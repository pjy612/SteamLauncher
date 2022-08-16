import { app, dialog, shell } from 'electron';
import { join, basename } from 'node:path';
import { pathExists, emptyDir, copy, writeFile, ensureDir, remove } from 'fs-extra';
import ini from 'ini';
import storage from '../instances/storage';
import appNotify from '../functions/app-notify';
import appExec from '../functions/app-exec';
import paths from '../configs/paths';
import { appCommandsLine } from '../app';
import appGetWindow from '../functions/app-get-window';
import SteamEmulator from './steam-emulator';
import SteamCloud from './steam-cloud';
import PCGamingWikiApi from './pcgamingwiki';
import storageDefaults from '../configs/storage-defaults';

class SteamGame {
  private static async clientLoader(dataGame: StoreGameDataType) {
    const loaderConfig = {
      Launcher: {
        Target: dataGame.executableFilePath,
        StartIn: dataGame.executableWorkingDirectory,
        CommandLine: dataGame.commandLine,
        SteamClientPath: paths.emulator.steamClientFilePath,
        SteamClientPath64: paths.emulator.steamClient64FilePath,
        Persist: storage.get('settings.ssePersist', storageDefaults.settings.ssePersist) ? 1 : 0,
        InjectDll: storage.get('settings.sseInjectDll', storageDefaults.settings.sseInjectDll) ? 1 : 0,
        ParanoidMode: storage.get('settings.sseParanoidMode', storageDefaults.settings.sseParanoidMode) ? 1 : 0,
      },
      SmartSteamEmu: {
        AppId: dataGame.appId,
      },
    };
    await writeFile(paths.clientLoader.configFilePath, ini.stringify(loaderConfig));

    await appExec(paths.clientLoader.filePath, [], paths.clientLoader.rootPath);
  }

  public static getPaths(dataGame: StoreGameDataType): StoreGameDataPathsType {
    const dataRootPath = join(paths.retriever.rootPath, dataGame.appId);
    const savesRootPath = join(paths.emulator.steamSavesPath, dataGame.appId);
    const savesRemoteRootPath = join(savesRootPath, 'remote');
    const savesCloudRootPath =
      typeof dataGame.pcGamingWikiName !== 'undefined' && dataGame.pcGamingWikiName.length > 0
        ? join(paths.cloud.rootPath, dataGame.pcGamingWikiName)
        : undefined;
    const achievementsRootPath = join(dataRootPath, 'achievements');
    const achievementsFilePath = join(dataRootPath, 'achievements.json');
    const statsFilePath = join(dataRootPath, 'stats.txt');
    const itemsFilePath = join(dataRootPath, 'items.json');
    const defaultItemsFilePath = join(dataRootPath, 'default_items.json');
    const dlcsFilePath = join(dataRootPath, 'DLC.txt');
    const steamInterfacesFilePath = join(dataRootPath, 'steam_interfaces.txt');
    const headerFilePath = join(dataRootPath, 'header.jpg');

    return {
      dataRootPath,
      savesRemoteRootPath,
      savesCloudRootPath,
      achievementsFilePath,
      achievementsRootPath,
      defaultItemsFilePath,
      dlcsFilePath,
      headerFilePath,
      itemsFilePath,
      statsFilePath,
      steamInterfacesFilePath,
    };
  }

  public static async generateGameExtraInfo(dataGame: StoreGameDataType) {
    const data = dataGame;
    const dataGameCloudName = await PCGamingWikiApi.getName(dataGame.appId);
    data.pcGamingWikiName = dataGameCloudName;
    const dataGamePaths = SteamGame.getPaths(dataGame);
    data.paths = dataGamePaths;
    return data;
  }

  public static async getData(appId: string) {
    const key = `games.${appId}`;
    const dataGame: StoreGameDataType | undefined = storage.get(key);
    if (typeof dataGame !== 'undefined') {
      return SteamGame.generateGameExtraInfo(dataGame);
    }
    return undefined;
  }

  public static async getAllData() {
    const dataGames = storage.get('games');
    if (typeof dataGames !== 'undefined') {
      for (const appId in dataGames) {
        if (Object.hasOwn(dataGames, appId)) {
          dataGames[appId] = await SteamGame.generateGameExtraInfo(dataGames[appId]);
        }
      }
    }
    return dataGames;
  }

  public static async launch(dataGame: StoreGameDataType, withoutEmu = false) {
    const dataGameExecutableFilePath = dataGame.executableFilePath;
    const dataGameExecutableWorkingDirectory = dataGame.executableWorkingDirectory;
    const dataGameCommandLine = dataGame.commandLine;

    if (withoutEmu) {
      await appExec(dataGameExecutableFilePath, dataGameCommandLine.split(' '), dataGameExecutableWorkingDirectory);
      return;
    }

    if (!(await new SteamEmulator().checkForUpdatesAndNotify())) {
      return;
    }

    const dataGameAppId = dataGame.appId;
    const dataGameDisableOverlay = dataGame.disableOverlay;
    const dataGameDisableNetworking = dataGame.disableNetworking;
    const dataGameDisableLanOnly = dataGame.disableLanOnly;
    const dataGameForceAccountName = dataGame.forceAccountName;
    const dataGameForceAccountLanguage = dataGame.forceAccountLanguage;
    const dataGameForceAccountSteamId = dataGame.forceAccountSteamId;
    const dataGameForceAccountListenPort = dataGame.forceAccountListenPort;
    const dataGamePaths = dataGame.paths;

    const dataAccount = storage.get('account') as StoreAccountType;
    const dataSettings = storage.get('settings');
    const dataNetwork = dataSettings.network;

    // root/disable_lan_only.txt
    await (dataGameDisableLanOnly
      ? writeFile(paths.emulator.disableLanOnlyFilePath, '')
      : remove(paths.emulator.disableLanOnlyFilePath));

    // root/local_save.txt
    await writeFile(paths.emulator.localSaveFilePath, 'steam_saves');

    // steam_saves
    await ensureDir(paths.emulator.steamSavesPath);

    // steam_saves/settings
    await ensureDir(paths.emulator.steamSavesSettingsPath);

    await writeFile(paths.emulator.steamSavesSettingsAccountNameFilePath, dataAccount.name);
    await writeFile(paths.emulator.steamSavesSettingsLanguageFilePath, dataAccount.language);
    await writeFile(paths.emulator.steamSavesSettingsListenPortFilePath, dataAccount.listenPort);
    await writeFile(paths.emulator.steamSavesSettingsUserSteamIdFilePath, dataAccount.steamId);

    // steam_settings
    await emptyDir(paths.emulator.steamSettingsRootPath);

    await copy(dataGamePaths.dataRootPath, paths.emulator.steamSettingsRootPath, {
      filter: (source) => basename(source) !== 'header.jpg',
    });

    // steam_settings/steam_appid.txt
    await writeFile(paths.emulator.steamSettingsSteamAppIdFilePath, dataGameAppId);

    // steam_settings/force_account_name.txt
    if (dataGameForceAccountName.length > 0) {
      await writeFile(paths.emulator.steamSettingsForceAccountNameFilePath, dataGameForceAccountName);
    }

    // steam_settings/force_language.txt
    if (dataGameForceAccountLanguage.length > 0) {
      await writeFile(paths.emulator.steamSettingsForceLanguageFilePath, dataGameForceAccountLanguage);
    }

    // steam_settings/force_steamid.txt
    if (dataGameForceAccountSteamId.length > 0) {
      await writeFile(paths.emulator.steamSettingsForceSteamIdFilePath, dataGameForceAccountSteamId);
    }

    // steam_settings/force_listen_port.txt
    if (dataGameForceAccountListenPort.length > 0) {
      await writeFile(paths.emulator.steamSettingsForceListenPortFilePath, dataGameForceAccountListenPort);
    }

    // steam_settings/disable_overlay.txt
    if (dataGameDisableOverlay) {
      await writeFile(paths.emulator.steamSettingsDisableOverlayFilePath, '');
    }

    // steam_settings/disable_networking.txt
    if (dataGameDisableNetworking) {
      await writeFile(paths.emulator.steamSettingsDisableNetworkingFilePath, '');
    }

    // steam_settings/offline.txt
    if (!dataNetwork) {
      await writeFile(paths.emulator.steamSettingsOfflineFilePath, '');
    }

    if (
      storage.get('settings.minimizeToTray', storageDefaults.settings.minimizeToTray) &&
      storage.get('settings.minimizeToTrayWhenLaunchGame', storageDefaults.settings.minimizeToTrayWhenLaunchGame)
    ) {
      const appWindow = appGetWindow();
      if (typeof appWindow !== 'undefined') {
        appWindow.minimize();
      }
    }

    await SteamGame.clientLoader(dataGame);
    await SteamCloud.backup(dataGame);
  }

  public static async launchFromAppCommandsLine() {
    const appId = appCommandsLine.appid as number | undefined;
    if (typeof appId !== 'undefined') {
      const dataGame = await SteamGame.getData(appId.toString());
      await (typeof dataGame !== 'undefined'
        ? SteamGame.launch(dataGame).then(() => app.quit())
        : dialog.showMessageBox({ message: `The game with appId ${appId} does not exist!`, type: 'error' }));
    }
  }

  public static async remove(appId: string) {
    const dataGames = await SteamGame.getAllData();
    if (typeof dataGames !== 'undefined') {
      const { name: dataGameName } = dataGames[appId];

      delete dataGames[appId];
      storage.set('games', dataGames);
      appNotify(`${dataGameName} removed successfully!`);
    }
  }

  public static async openFileLocation(dataGame: StoreGameDataType) {
    const dataGameExecutableFilePath = dataGame.executableFilePath;
    if (await pathExists(dataGameExecutableFilePath)) {
      shell.showItemInFolder(dataGameExecutableFilePath);
    } else {
      appNotify('The game path does not exists!');
    }
  }

  public static async openSavesLocation(dataGame: StoreGameDataType) {
    const dataGameSavesRemoteRootPath = dataGame.paths.savesRemoteRootPath;
    if (await pathExists(dataGameSavesRemoteRootPath)) {
      await shell.openPath(dataGameSavesRemoteRootPath);
    } else {
      appNotify('The game has no saves inside the emulator.');
    }
  }

  public static async openCloudSavesLocation(dataGame: StoreGameDataType) {
    const dataGameCloudRootPath = dataGame.paths.savesCloudRootPath;
    if (typeof dataGameCloudRootPath !== 'undefined' && (await pathExists(dataGameCloudRootPath))) {
      await shell.openPath(dataGameCloudRootPath);
    } else {
      appNotify('The game has no saves inside the cloud.');
    }
  }

  public static async openDataLocation(dataGame: StoreGameDataType) {
    const dataGameRootPath = dataGame.paths.dataRootPath;
    if (await pathExists(dataGameRootPath)) {
      await shell.openPath(dataGameRootPath);
    } else {
      appNotify('The game has no data inside the launcher!');
    }
  }

  public static createDesktopShortcut(dataGame: StoreGameDataType) {
    const dataGameAppId = dataGame.appId;
    const dataGameExecutableFilePath = dataGame.executableFilePath;
    const dataGameName = SteamGame.removeSpecialCharsName(dataGame.name);
    const shortcutPath = join(app.getPath('desktop'), `Launch ${dataGameName}.lnk`);
    const writeShortcut = shell.writeShortcutLink(shortcutPath, {
      args: `--appid ${dataGameAppId}`,
      icon: dataGameExecutableFilePath,
      iconIndex: 0,
      target: app.getPath('exe'),
    });
    if (!writeShortcut) {
      appNotify('Unknown error with creating shortcut!');
    }
  }

  public static removeSpecialCharsName(string_: string) {
    return string_.replace(/[^\w\s]/gu, '');
  }
}

export default SteamGame;
