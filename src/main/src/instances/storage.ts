import Conf from 'conf';

import { appIsDevelopment } from '../environments';
import paths from '../paths';

const storage = new Conf<StoreType>({
  configName: `config${appIsDevelopment ? '.dev' : ''}`,
  cwd: paths.appDataPath,
  defaults: {
    settings: {
      httpsRejectUnauthorized: true,
      network: true,
    },
  },
});

export default storage;
