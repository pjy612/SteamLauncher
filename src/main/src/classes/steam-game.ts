import { app, dialog, shell } from 'electron';
import { join, basename } from 'node:path';
import { pathExists, emptyDir, copy, writeFile, ensureDir, remove } from 'fs-extra';
import ini from 'ini';
import appNotify from '../functions/app-notify';
import storage from '../instances/storage';
import paths from '../configs/paths';
import appExec from '../functions/app-exec';
import SteamEmulator from './steam-emulator';
// eslint-disable-next-line import/no-cycle
import SteamCloud from './steam-cloud';

class SteamGame {
  private static async clientLoader(dataGame: StoreGameDataType) {
    const loaderConfig = {
      Launcher: {
        Target: dataGame.executableFilePath,
        StartIn: dataGame.executableWorkingDirectory,
        CommandLine: dataGame.commandLine,
        SteamClientPath: paths.emulator.steamClientFilePath,
        SteamClientPath64: paths.emulator.steamClient64FilePath,
        Persist: storage.get('settings.ssePersist') ? 1 : 0,
        InjectDll: storage.get('settings.sseInjectDll') ? 1 : 0,
        ParanoidMode: storage.get('settings.sseParanoidMode') ? 1 : 0,
      },
      SmartSteamEmu: {
        AppId: dataGame.appId,
      },
    };
    await writeFile(paths.clientLoader.configFilePath, ini.stringify(loaderConfig));

    await appExec(paths.clientLoader.filePath, [], paths.clientLoader.rootPath);
  }

  public static async launch(dataGame: StoreGameDataType, withoutEmu = false) {
    const dataGameExecutableFilePath = dataGame.executableFilePath;
    const dataGameExecutableWorkingDirectory = dataGame.executableWorkingDirectory;
    const dataGameCommandLine = dataGame.commandLine;
    const dataGameAppId = dataGame.appId;
    const dataGameDisableOverlay = dataGame.disableOverlay;
    const dataGameDisableNetworking = dataGame.disableNetworking;
    const dataGameDisableLanOnly = dataGame.disableLanOnly;
    const dataGameForceAccountName = dataGame.forceAccountName;
    const dataGameForceAccountLanguage = dataGame.forceAccountLanguage;
    const dataGameForceAccountSteamId = dataGame.forceAccountSteamId;
    const dataGameForceAccountListenPort = dataGame.forceAccountListenPort;
    const dataGamePaths = SteamGame.paths(dataGameAppId);
    const dataAccount = storage.get('account') as StoreAccountType;
    const dataSettings = storage.get('settings');
    const dataNetwork = dataSettings.network;

    if (withoutEmu) {
      await appExec(dataGameExecutableFilePath, dataGameCommandLine.split(' '), dataGameExecutableWorkingDirectory);
      return;
    }

    if (!(await SteamEmulator.checkForUpdatesAndNotify())) {
      appNotify('SteamEmulator: Error with the verification of the emulator, check the logs.');
      return;
    }

    // root/disable_lan_only.txt
    await (dataGameDisableLanOnly
      ? writeFile(paths.emulator.disableLanOnlyFilePath, '')
      : remove(paths.emulator.disableLanOnlyFilePath));

    // root/local_save.txt
    await writeFile(paths.emulator.localSaveFilePath, 'steam_saves');

    // steam_saves
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
      filter: (source) => basename(source) !== 'header.jpg',
    });

    // steam_settings/steam_appid.txt
    await writeFile(paths.emulator.settingsSteamAppIdFilePath, dataGameAppId);

    // steam_settings/force_account_name.txt
    if (dataGameForceAccountName.length > 0) {
      await writeFile(paths.emulator.settingsForceAccountNameFilePath, dataGameForceAccountName);
    }

    // steam_settings/force_language.txt
    if (dataGameForceAccountLanguage.length > 0) {
      await writeFile(paths.emulator.settingsForceLanguageFilePath, dataGameForceAccountLanguage);
    }

    // steam_settings/force_steamid.txt
    if (dataGameForceAccountSteamId.length > 0) {
      await writeFile(paths.emulator.settingsForceSteamIdFilePath, dataGameForceAccountSteamId);
    }

    // steam_settings/force_listen_port.txt
    if (dataGameForceAccountListenPort.length > 0) {
      await writeFile(paths.emulator.settingsForceListenPortFilePath, dataGameForceAccountListenPort);
    }

    // steam_settings/disable_overlay.txt
    if (dataGameDisableOverlay) {
      await writeFile(paths.emulator.settingsDisableOverlayFilePath, '');
    }

    // steam_settings/disable_networking.txt
    if (dataGameDisableNetworking) {
      await writeFile(paths.emulator.settingsDisableNetworkingFilePath, '');
    }

    // steam_settings/offline.txt
    if (!dataNetwork) {
      await writeFile(paths.emulator.settingsOfflineFilePath, '');
    }

    await SteamGame.clientLoader(dataGame);
    SteamCloud.backup(dataGame);
  }

  public static launchFromAppCommandsLine(appCommandsLine: string[]) {
    if (appCommandsLine.length > 0) {
      const { 0: argumentAppId } = appCommandsLine;
      const data: StoreGameDataType | undefined = storage.get(`games.${argumentAppId}`);
      if (typeof data !== 'undefined') {
        void SteamGame.launch(data);
      } else {
        dialog.showErrorBox('Error', `The game with appId ${argumentAppId} does not exist!`);
      }
    }
  }

  public static remove(appId: string) {
    const dataGames = storage.get('games');
    if (typeof dataGames !== 'undefined') {
      const { name: dataGameName } = dataGames[appId];
      delete dataGames[appId];
      storage.set('games', dataGames);
      appNotify(`${dataGameName} removed successfully!`);
    }
  }

  public static paths(appId: string) {
    const steamRetrieverPath = join(paths.appDataPath, 'steam_retriever');

    const appIdSavesPath = join(paths.emulator.savesPath, appId);
    const appIdSavesRemotePath = join(appIdSavesPath, 'remote');
    const appIdDataPath = join(steamRetrieverPath, appId);
    const appIdAchievementsPath = join(appIdDataPath, 'achievements');
    const appIdAchievementsInfoPath = join(appIdDataPath, 'achievements.json');
    const appIdStatsInfoPath = join(appIdDataPath, 'stats.txt');
    const appIdItemsInfoPath = join(appIdDataPath, 'items.json');
    const appIdDefaultItemsInfoPath = join(appIdDataPath, 'default_items.json');
    const appIdDlcsInfoPath = join(appIdDataPath, 'DLC.txt');
    const appIdSteamInterfacesPath = join(appIdDataPath, 'steam_interfaces.txt');
    const appIdHeaderPath = join(appIdDataPath, 'header.jpg');

    return {
      appIdDataPath,
      appIdSavesPath,
      appIdSavesRemotePath,
      appIdAchievementsInfoPath,
      appIdAchievementsPath,
      appIdDefaultItemsInfoPath,
      appIdDlcsInfoPath,
      appIdHeaderPath,
      appIdItemsInfoPath,
      appIdStatsInfoPath,
      appIdSteamInterfacesPath,
    };
  }

  public static async openFileLocation(appId: string) {
    const dataGame: StoreGameDataType = storage.get(`games.${appId}`);
    const dataGameExecutableFilePath = dataGame.executableFilePath;
    if (await pathExists(dataGameExecutableFilePath)) {
      shell.showItemInFolder(dataGameExecutableFilePath);
    } else {
      appNotify('The game path does not exists!');
    }
  }

  public static async openSavesLocation(appId: string) {
    const dataGamePaths = SteamGame.paths(appId);
    const dataGameSavesPath = dataGamePaths.appIdSavesPath;
    if (await pathExists(dataGameSavesPath)) {
      await shell.openPath(dataGameSavesPath);
    } else {
      appNotify('The game has no saves inside the emulator.');
    }
  }

  public static openCloudSavesLocation() {
    // TODO: You have to find the game folders by the name that pcgamingwiki gives to the game.
    appNotify('function not available yet');
  }

  public static async openDataLocation(appId: string) {
    const { appIdDataPath } = SteamGame.paths(appId);
    if (await pathExists(appIdDataPath)) {
      await shell.openPath(appIdDataPath);
    } else {
      appNotify('The game has no data inside the launcher!');
    }
  }

  public static createDesktopShortcut(appId: string) {
    const dataGame: StoreGameDataType = storage.get(`games.${appId}`);
    const dataGameName = SteamGame.removeSpecialCharsName(dataGame.name);
    const shortcutPath = join(app.getPath('desktop'), `Launch ${dataGameName}.lnk`);
    const writeShortcut = shell.writeShortcutLink(shortcutPath, {
      args: dataGame.appId,
      icon: dataGame.executableFilePath,
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
