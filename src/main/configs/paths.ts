import { app } from 'electron';
import { dirname, join } from 'node:path';
import { appIsInstalled } from '../app';
import appRootPath from '../functions/app-root-path';

const appResourceAsarPath = app.getAppPath();
const appResourceRootPath = app.isPackaged ? dirname(appResourceAsarPath) : appResourceAsarPath;

/*
 * IS PACKAGED:
 *    IS INSTALLED:
 *        userData/data
 *    ELSE
 *        ./data
 * ELSE
 *    ./build/data
 */
const appDataRootPath = app.isPackaged
  ? join(appIsInstalled ? app.getPath('userData') : appRootPath, 'data')
  : join(appResourceRootPath, 'build', 'data');

const appSteamCloudRootPath = join(appDataRootPath, 'steam_cloud');
const appSteamRetrieverRootPath = join(appDataRootPath, 'steam_retriever');

const appLogsRootPath = join(appDataRootPath, 'logs');
const appLogsFilePath = `${app.getName()}.%DATE%.log`;

const emulatorRootPath = join(appDataRootPath, 'steam_emulator');
const emulatorSteamSettingsRootPath = join(emulatorRootPath, 'steam_settings');
const emulatorSteamSavesRootPath = join(emulatorRootPath, 'steam_saves');
const emulatorSteamSettingsSavesRootPath = join(emulatorSteamSavesRootPath, 'settings');

/*
 * IS PACKAGED:
 *    ./resources/bin
 * ELSE
 *    ./build/bin
 */
const appBinRootPath = app.isPackaged ? join(appResourceRootPath, 'bin') : join(appResourceRootPath, 'build', 'bin');

const signToolRootPath = join(appBinRootPath, 'signtool');
const ludusaviRootPath = join(appBinRootPath, 'ludusavi');
const generateInterfacesFileRootPath = join(appBinRootPath, 'generate_interfaces_file');

const clientLoaderRootPath = join(appBinRootPath, 'SmartSteamLoader');
const clientLoaderFilePath = join(appBinRootPath, 'SmartSteamLoader', 'SmartSteamLoader_x64.exe');
const clientLoaderConfigFilePath = join(appBinRootPath, 'SmartSteamLoader', 'SmartSteamEmu.ini');

const paths = {
  appDataRootPath,
  emulator: {
    rootPath: emulatorRootPath,
    steamClientFilePath: join(emulatorRootPath, 'steamclient.dll'),
    steamClient64FilePath: join(emulatorRootPath, 'steamclient64.dll'),
    localSaveFilePath: join(emulatorRootPath, 'local_save.txt'),
    disableLanOnlyFilePath: join(emulatorRootPath, 'disable_lan_only.txt'),
    steamJobsRootPath: join(emulatorRootPath, 'steam_jobs'),
    steamSettingsRootPath: emulatorSteamSettingsRootPath,
    steamSettingsForceAccountNameFilePath: join(emulatorSteamSettingsRootPath, 'force_account_name.txt'),
    steamSettingsForceLanguageFilePath: join(emulatorSteamSettingsRootPath, 'force_language.txt'),
    steamSettingsForceSteamIdFilePath: join(emulatorSteamSettingsRootPath, 'force_steamid.txt'),
    steamSettingsForceListenPortFilePath: join(emulatorSteamSettingsRootPath, 'force_listen_port.txt'),
    steamSettingsDisableOverlayFilePath: join(emulatorSteamSettingsRootPath, 'disable_overlay.txt'),
    steamSettingsDisableNetworkingFilePath: join(emulatorSteamSettingsRootPath, 'disable_networking.txt'),
    steamSettingsOfflineFilePath: join(emulatorSteamSettingsRootPath, 'offline.txt'),
    steamSettingsSteamAppIdFilePath: join(emulatorSteamSettingsRootPath, 'steam_appid.txt'),
    steamSavesPath: emulatorSteamSavesRootPath,
    steamSavesSettingsPath: emulatorSteamSettingsSavesRootPath,
    steamSavesSettingsAccountNameFilePath: join(emulatorSteamSettingsSavesRootPath, 'account_name.txt'),
    steamSavesSettingsLanguageFilePath: join(emulatorSteamSettingsSavesRootPath, 'language.txt'),
    steamSavesSettingsListenPortFilePath: join(emulatorSteamSettingsSavesRootPath, 'listen_port.txt'),
    steamSavesSettingsUserSteamIdFilePath: join(emulatorSteamSettingsSavesRootPath, 'user_steam_id.txt'),
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
  generateInterfacesFile: {
    filePath: join(generateInterfacesFileRootPath, 'generate_interfaces_file.exe'),
  },
  ludusavi: {
    rootPath: ludusaviRootPath,
    filePath: join(ludusaviRootPath, 'ludusavi.exe'),
  },
  files: {
    iconFilePath: join(appResourceAsarPath, 'build', 'resources', 'icon.ico'),
    preloadFilePath: join(appResourceAsarPath, 'build', 'dist', 'preload', 'preload.cjs'),
    renderFilePath: join(appResourceAsarPath, 'build', 'dist', 'render', 'index.html'),
  },
};

export default paths;
