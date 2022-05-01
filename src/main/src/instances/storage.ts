import Conf from 'conf';
import paths from '../paths';
import migrations from './storage/migrations';

const storage = new Conf<StoreType>({
  configName: `config${import.meta.env.DEV ? '.dev' : ''}`,
  cwd: paths.appDataPath,
  defaults: {
    settings: {
      httpsRejectUnauthorized: true,
      network: true,
    },
  },
  migrations,
});

export default storage;
