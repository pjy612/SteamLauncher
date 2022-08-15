import { app } from 'electron';
import Axios from 'axios';
import Conf from 'conf';
import { setupCache, buildStorage } from 'axios-cache-interceptor';
import paths from '../configs/paths';

const fileStorage = new Conf<AxiosStorageType>({
  cwd: paths.appDataRootPath,
  configName: `axios.cache${app.isPackaged ? '' : '.dev'}`,
});

const axiosStorage = buildStorage({
  find(key) {
    return fileStorage.get(key);
  },

  set(key, value) {
    fileStorage.set(key, value);
  },

  remove(key) {
    fileStorage.delete(key);
  },
});

const axios = setupCache(Axios.create(), {
  storage: axiosStorage,
  // NOTE: expiration time 4 hours
  ttl: 1000 * 60 * 60 * 4,
});

export default axios;
