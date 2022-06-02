import { app } from 'electron';
import { dirname, join } from 'node:path';
import { appIsInstalled } from './app';
import appRootPath from './functions/app-root-path';

const appResourceAsarPath = app.getAppPath();
const appResourcePath = app.isPackaged ? dirname(appResourceAsarPath) : appResourceAsarPath;

const appDataPath = join(appIsInstalled ? app.getPath('userData') : appRootPath, 'data');
const appBinPath = join(appResourcePath, 'bin');

const appEmuPath = join(appDataPath, 'steam_emulator');
const appEmuSteamSettings = join(appEmuPath, 'steam_settings');
const appEmuSteamSaves = join(appEmuPath, 'steam_saves');
const appEmuSteamSettingsSaves = join(appEmuSteamSaves, 'settings');

const paths = {
  appDataPath,
  appLogsPath: join(appDataPath, 'logs'),
  emulator: {
    rootPath: appEmuPath,
    loaderFilePath: join(appBinPath, 'win/SmartSteamLoader/SmartSteamLoader_x64.exe'),
    loaderConfigFilePath: join(appBinPath, 'win/SmartSteamLoader/SmartSteamEmu.ini'),
    jobsPath: join(appEmuPath, 'jobs'),
    steamClientFilePath: join(appEmuPath, 'steamclient.dll'),
    steamClient64FilePath: join(appEmuPath, 'steamclient64.dll'),
    localSaveFilePath: join(appEmuPath, 'local_save.txt'),
    disableLanOnlyFilePath: join(appEmuPath, 'disable_lan_only.txt'),
    settingsPath: appEmuSteamSettings,
    settingsForceAccountNameFilePath: join(appEmuSteamSettings, 'force_account_name.txt'),
    settingsForceLanguageFilePath: join(appEmuSteamSettings, 'force_language.txt'),
    settingsForceSteamIdFilePath: join(appEmuSteamSettings, 'force_steamid.txt'),
    settingsForceListenPortFilePath: join(appEmuSteamSettings, 'force_listen_port.txt'),
    settingsDisableOverlayFilePath: join(appEmuSteamSettings, 'disable_overlay.txt'),
    settingsDisableNetworkingFilePath: join(appEmuSteamSettings, 'disable_networking.txt'),
    settingsOfflineFilePath: join(appEmuSteamSettings, 'offline.txt'),
    settingsSteamAppIdFilePath: join(appEmuSteamSettings, 'steam_appid.txt'),
    savesPath: appEmuSteamSaves,
    savesSettingsPath: appEmuSteamSettingsSaves,
    savesSettingsAccountNameFilePath: join(appEmuSteamSettingsSaves, 'account_name.txt'),
    savesSettingsLanguageFilePath: join(appEmuSteamSettingsSaves, 'language.txt'),
    savesSettingsListenPortFilePath: join(appEmuSteamSettingsSaves, 'listen_port.txt'),
    savesSettingsUserSteamIdFilePath: join(appEmuSteamSettingsSaves, 'user_steam_id.txt'),
  },
  files: {
    preloadFilePath: join(appResourceAsarPath, '/src/preload/dist/preload.cjs.js'),
    renderFilePath: join(appResourceAsarPath, '/src/render/dist/index.html'),
    signToolFilePath: join(appBinPath, 'win/signtool/signtool.exe'),
    ludusaviFilePath: join(appBinPath, 'win/ludusavi/ludusavi.exe'),
  },
};

export default paths;
