import childProcess from 'node:child_process';
import {
  join,
} from 'node:path';
import {
  promisify,
} from 'node:util';
import {
  pathExists,
  emptyDir,
  copy,
  writeFile,
} from 'fs-extra';
import ini from 'ini';
import storage from '../storage';
import gamePathsByAppId from './game-paths-by-appid';
import notify from './notify';

const execFile = promisify(childProcess.execFile);

const gameLauncher = async (dataGame: StoreGameDataType, withoutEmu = false) => {
  const dataAccount = storage.get('account')!;
  const dataSettings = storage.get('settings');

  const paths = gamePathsByAppId(dataGame.appId);

  const dataGamePath = dataGame.path;
  const dataGameRunPath = dataGame.runPath;
  const dataGameCommandLine = dataGame.commandLine;

  if (withoutEmu) {
    await execFile(dataGamePath, dataGameCommandLine.split(' '));
    notify(`Launch normally ${dataGame.name}`);
    return;
  }

  const emulatorPath = dataSettings.steamClientPath!;
  const emulatorLoaderPath = join(emulatorPath, 'steamclient_loader.exe');

  if (!(await pathExists(emulatorLoaderPath))) {
    notify('Assign the correct folder of the experimental client in the settings!');
    return;
  }

  const emulatorSteamSettingsPath = join(emulatorPath, 'steam_settings');

  if (!(await pathExists(emulatorSteamSettingsPath))) {
    await emptyDir(emulatorSteamSettingsPath);
  }

  await copy(paths.appIdDataPath, emulatorSteamSettingsPath);

  const emulatorSettingsForceAccountName = join(
    emulatorSteamSettingsPath,
    'force_account_name.txt',
  );
  const emulatorSettingsForceLanguage = join(emulatorSteamSettingsPath, 'force_language.txt');
  const emulatorSettingsForceSteamId = join(emulatorSteamSettingsPath, 'force_steamid.txt');

  await writeFile(emulatorSettingsForceAccountName, dataAccount.name);
  await writeFile(emulatorSettingsForceLanguage, dataAccount.language);
  await writeFile(emulatorSettingsForceSteamId, dataAccount.steamId);

  const emulatorSettingsForceListenPort = join(emulatorSteamSettingsPath, 'force_listen_port.txt');
  const emulatorSettingsOverlay = join(emulatorSteamSettingsPath, 'disable_overlay.txt');

  await writeFile(emulatorSettingsForceListenPort, dataGame.listenPort);

  if (!dataGame.overlay) {
    await writeFile(emulatorSettingsOverlay, '');
  }

  const emulatorSettingsDisableNetworking = join(
    emulatorSteamSettingsPath,
    'disable_networking.txt',
  );
  const emulatorSettingsOffline = join(emulatorSteamSettingsPath, 'offline.txt');

  if (!dataSettings.network) {
    await writeFile(emulatorSettingsDisableNetworking, '');
    await writeFile(emulatorSettingsOffline, '');
  }

  const emulatorLoaderConfigPath = join(emulatorPath, 'ColdClientLoader.ini');

  const loaderConfig = {
    SteamClient: {
      AppId: dataGame.appId,
      Exe: dataGamePath,
      ExeCommandLine: dataGameCommandLine,
      ExeRunDir: dataGameRunPath,
      SteamClient64Dll: join(emulatorPath, 'steamclient64.dll'),
      SteamClientDll: join(emulatorPath, 'steamclient.dll'),
    },
  };

  await writeFile(emulatorLoaderConfigPath, ini.stringify(loaderConfig));

  await execFile(emulatorLoaderPath);

  notify(`Launch ${dataGame.name}`);
};

export default gameLauncher;
