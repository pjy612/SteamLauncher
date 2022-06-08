import { app } from 'electron';
import Conf, { Options } from 'conf';
import paths from '../configs/paths';
// eslint-disable-next-line import/no-cycle
import { appGetWindow } from '../functions/app-window';
import migrations from './storage/migrations';

const options: Options<StoreType> = {
  cwd: paths.appDataRootPath,
  watch: true,
  configName: `config${app.isPackaged ? '' : '.dev'}`,
  defaults: {
    settings: {
      network: true,
      httpsRejectUnauthorized: true,
    },
  },
  migrations,
};
const storage = new Conf<StoreType>(options);

storage.onDidChange('games', () => {
  const window = appGetWindow();
  if (typeof window !== 'undefined') {
    window.webContents.send('app-home-reload-games-list');
  }
});

export default storage;
