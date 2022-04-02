import {
  join,
} from 'node:path';
import {
  app,
} from 'electron';

const environments = import.meta.env;
const appPath = app.getAppPath();
const appDataPath = app.getPath('appData');
const binPath = join(appPath + (environments.PROD ? '.unpacked' : ''), 'bin/win');

export const paths = {
  emulator: {
    saves: join(appDataPath, 'Goldberg SteamEmu Saves'),
  },
  iconFilePath: join(appPath, '/build/resources/icon.ico'),
  preloadFilePath: join(appPath, '/src/preload/dist/preload.cjs.js'),
  renderFilePath: join(appPath, '/src/render/dist/index.html'),
  signToolBin: join(binPath, 'signtool/signtool.exe'),
};

export const allowedWillNavigateUrls = new Set([
  'http://localhost:3000',
]);

export const allowedExternalUrls = new Set([
  'https://www.paypal.com',
  'https://github.com',
  'https://gitlab.com',
  'https://cs.rin.ru',
  'https://steamcommunity.com',
]);

const defaults = {
  allowedExternalUrls,
  allowedWillNavigateUrls,
  paths,
};

export default defaults;
