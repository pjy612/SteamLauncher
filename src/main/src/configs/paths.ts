import { app } from 'electron';
import { dirname, join } from 'node:path';
import { appIsInstalled } from '../app';
import appRootPath from '../functions/app-root-path';

const appResourceAsarPath = app.getAppPath();
const appResourcePath = app.isPackaged ? dirname(appResourceAsarPath) : appResourceAsarPath;

const appDataRootPath = join(appIsInstalled ? app.getPath('userData') : appRootPath, 'data');
const appBinRootPath = join(appResourcePath, 'bin');
const appSteamCloudRootPath = join(appDataRootPath, 'steam_cloud');
const appSteamRetrieverRootPath = join(appDataRootPath, 'steam_retriever');

const appLogsRootPath = join(appDataRootPath, 'logs');
const appLogsFilePath = `${app.getName()}.%DATE%.log`;

const emulatorRootPath = join(appDataRootPath, 'steam_emulator');
const emulatorSteamSettingsRootPath = join(emulatorRootPath, 'steam_settings');
const emulatorSteamSavesRootPath = join(emulatorRootPath, 'steam_saves');
const emulatorSteamSettingsSavesRootPath = join(emulatorSteamSavesRootPath, 'settings');

const signToolRootPath = join(appBinRootPath, 'win/signtool');
const ludusaviRootPath = join(appBinRootPath, 'win/ludusavi');

const clientLoaderRootPath = join(appBinRootPath, 'win/SmartSteamLoader');
const clientLoaderFilePath = join(appBinRootPath, 'win/SmartSteamLoader/SmartSteamLoader_x64.exe');
const clientLoaderConfigFilePath = join(appBinRootPath, 'win/SmartSteamLoader/SmartSteamEmu.ini');

const paths = {
  appDataRootPath,
  emulator: {
    rootPath: emulatorRootPath,
    jobsPath: join(emulatorRootPath, 'jobs'),
    steamClientFilePath: join(emulatorRootPath, 'steamclient.dll'),
    steamClient64FilePath: join(emulatorRootPath, 'steamclient64.dll'),
    localSaveFilePath: join(emulatorRootPath, 'local_save.txt'),
    disableLanOnlyFilePath: join(emulatorRootPath, 'disable_lan_only.txt'),
    settingsPath: emulatorSteamSettingsRootPath,
    settingsForceAccountNameFilePath: join(emulatorSteamSettingsRootPath, 'force_account_name.txt'),
    settingsForceLanguageFilePath: join(emulatorSteamSettingsRootPath, 'force_language.txt'),
    settingsForceSteamIdFilePath: join(emulatorSteamSettingsRootPath, 'force_steamid.txt'),
    settingsForceListenPortFilePath: join(emulatorSteamSettingsRootPath, 'force_listen_port.txt'),
    settingsDisableOverlayFilePath: join(emulatorSteamSettingsRootPath, 'disable_overlay.txt'),
    settingsDisableNetworkingFilePath: join(emulatorSteamSettingsRootPath, 'disable_networking.txt'),
    settingsOfflineFilePath: join(emulatorSteamSettingsRootPath, 'offline.txt'),
    settingsSteamAppIdFilePath: join(emulatorSteamSettingsRootPath, 'steam_appid.txt'),
    savesPath: emulatorSteamSavesRootPath,
    savesSettingsPath: emulatorSteamSettingsSavesRootPath,
    savesSettingsAccountNameFilePath: join(emulatorSteamSettingsSavesRootPath, 'account_name.txt'),
    savesSettingsLanguageFilePath: join(emulatorSteamSettingsSavesRootPath, 'language.txt'),
    savesSettingsListenPortFilePath: join(emulatorSteamSettingsSavesRootPath, 'listen_port.txt'),
    savesSettingsUserSteamIdFilePath: join(emulatorSteamSettingsSavesRootPath, 'user_steam_id.txt'),
  },
  logs: {
    rootPath: appLogsRootPath,
    filePath: appLogsFilePath,
  },
  cloud: {
    rootPath: appSteamCloudRootPath,
  },
  retriever: {
    rootPath: appSteamRetrieverRootPath,
  },
  clientLoader: {
    rootPath: clientLoaderRootPath,
    filePath: clientLoaderFilePath,
    configFilePath: clientLoaderConfigFilePath,
  },
  signTool: {
    rootPath: signToolRootPath,
    filePath: join(signToolRootPath, 'signtool.exe'),
  },
  ludusavi: {
    rootPath: ludusaviRootPath,
    filePath: join(ludusaviRootPath, 'ludusavi.exe'),
  },
  files: {
    preloadFilePath: join(appResourceAsarPath, '/src/preload/dist/preload.cjs.js'),
    renderFilePath: join(appResourceAsarPath, '/src/render/dist/index.html'),
  },
};

export default paths;
