import { app } from 'electron';
import Conf, { Options } from 'conf';
import paths from '../configs/paths';
import appGetWindow from '../functions/app-get-window';
import migrations from './storage/migrations';
import storageDefaults from '../configs/storage-defaults';

const options: Options<StoreType> = {
  cwd: paths.appDataRootPath,
  watch: true,
  configName: `config${app.isPackaged ? '' : '.dev'}`,
  defaults: { ...storageDefaults },
  migrations,
};
const storage = new Conf<StoreType>(options);

storage.onDidChange('games', () => {
  const appWindow = appGetWindow();
  if (typeof appWindow !== 'undefined') {
    appWindow.webContents.send('app-home-reload-games-list');
  }
});

// TODO: monitor games when they are uninstalled

export default storage;
