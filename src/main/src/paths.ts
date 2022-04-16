import { join, resolve } from 'node:path';
import { app } from 'electron';
import { appIsDevelopment, appIsProduction } from './environments';

const appRootPath = appIsDevelopment ? app.getAppPath() : resolve(app.getAppPath(), '../../');
const appResourcePath = app.getAppPath();
const appDataPath = join(appRootPath, 'data');
const appLogsPath = join(appDataPath, 'logs');
const appEmuPath = join(appDataPath, 'steam_emulator');
const appBinPath = join(appResourcePath + (appIsProduction ? '.unpacked' : ''), 'bin');

const appEmuSteamSettings = join(appEmuPath, 'steam_settings');
const appEmuSteamSaves = join(appEmuPath, 'steam_saves');
const appEmuSteamSettingsSaves = join(appEmuSteamSaves, 'settings');

const paths = {
  appRootPath,
  appDataPath,
  appLogsPath,
  emulator: {
    rootPath: appEmuPath,
    jobsPath: join(appEmuPath, 'jobs'),
    loaderConfigFilePath: join(appEmuPath, 'ColdClientLoader.ini'),
    steamClientFilePath: join(appEmuPath, 'steamclient.dll'),
    steamClient64FilePath: join(appEmuPath, 'steamclient64.dll'),
    localSaveFilePath: join(appEmuPath, 'local_save.txt'),
    settingsPath: appEmuSteamSettings,
    settingsDisableOverlayFilePath: join(appEmuSteamSettings, 'disable_overlay.txt'),
    settingsDisableNetworkingFilePath: join(appEmuSteamSettings, 'disable_networking.txt'),
    settingsOfflineFilePath: join(appEmuSteamSettings, 'offline.txt'),
    savesPath: appEmuSteamSaves,
    savesSettingsPath: appEmuSteamSettingsSaves,
    savesSettingsAccountNameFilePath: join(appEmuSteamSettingsSaves, 'account_name.txt'),
    savesSettingsLanguageFilePath: join(appEmuSteamSettingsSaves, 'language.txt'),
    savesSettingsListenPortFilePath: join(appEmuSteamSettingsSaves, 'listen_port.txt'),
    savesSettingsUserSteamIdFilePath: join(appEmuSteamSettingsSaves, 'user_steam_id.txt'),
    loaderPath: join(appEmuPath, 'steamclient_loader.exe'),
  },
  files: {
    iconFile: join(appResourcePath, '/build/resources/icon.ico'),
    preloadFile: join(appResourcePath, '/src/preload/dist/preload.cjs.js'),
    renderFile: join(appResourcePath, '/src/render/dist/index.html'),
    signToolFile: join(appBinPath, 'win/signtool/signtool.exe'),
    ludusaviFile: join(appBinPath, 'win/ludusavi/ludusavi.exe'),
  },
};

export default paths;
