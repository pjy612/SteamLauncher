import { app } from 'electron';
import Conf from 'conf';
import paths from '../paths';
// eslint-disable-next-line import/no-cycle
import { getWindow } from '../functions/app-window';
import migrations from './storage/migrations';

const storage = new Conf<StoreType>({
  configName: `config${app.isPackaged ? '' : '.dev'}`,
  cwd: paths.appDataPath,
  watch: true,
  defaults: {
    settings: {
      httpsRejectUnauthorized: true,
      network: true,
    },
  },
  migrations,
});

storage.onDidChange('games', () => {
  const window = getWindow();
  if (typeof window !== 'undefined') {
    window.webContents.send('app-home-reload-games-list');
  }
});

export default storage;
