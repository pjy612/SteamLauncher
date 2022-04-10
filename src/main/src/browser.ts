import { app, BrowserWindow, Rectangle, shell } from 'electron';
import log from 'electron-log';
import { paths, allowedExternalUrls } from './config';
import storage from './storage';

const environments = import.meta.env;
const viteServerUrl = 'http://localhost:3000/';

const stateChangeHandler = (win: BrowserWindow) => {
  storage.set('window.bounds', win.getBounds());
  storage.set('window.isMaximized', win.isMaximized());
  storage.set('window.isFullScreen', win.isFullScreen());
};

export const createWindow = async () => {
  const win = new BrowserWindow({
    backgroundColor: '#161920',
    frame: environments.DEV,
    height: 720,
    icon: paths.iconFilePath,
    minHeight: 720,
    minWidth: 800,
    show: false,
    title: app.getName(),
    webPreferences: {
      // SECURITY: disable devtools in production mode
      devTools: environments.DEV,
      preload: paths.preloadFilePath,
      // NOTE: local files are not displayed in developer mode
      webSecurity: environments.PROD,
    },
    width: 800,
  });

  win.on('ready-to-show', () => {
    win.show();

    const windowIsMaximized = storage.get('window.isMaximized', false);
    if (windowIsMaximized) {
      win.maximize();
    }

    const windowIsFullScreen = storage.get('window.isFullScreen', false);
    if (windowIsFullScreen) {
      win.setFullScreen(true);
    }

    const windowBounds = storage.get('window.bounds');
    if (typeof windowBounds !== 'undefined' && win.isNormal()) {
      win.setBounds(windowBounds as Partial<Rectangle>);
    }
  });

  const windowStateChangeName = 'window-state-change';

  win.on('resized', () => {
    stateChangeHandler(win);
  });

  win.on('moved', () => {
    stateChangeHandler(win);
  });

  win.on('close', () => {
    stateChangeHandler(win);
  });

  win.on('maximize', () => {
    stateChangeHandler(win);
    win.webContents.send(windowStateChangeName, true);
  });

  win.on('unmaximize', () => {
    stateChangeHandler(win);
    win.webContents.send(windowStateChangeName, false);
  });

  win.webContents.on('did-finish-load', () => {
    win.webContents.send(windowStateChangeName, win.isMaximized());
  });

  win.webContents.openDevTools({
    mode: 'undocked',
  });

  if (environments.PROD) {
    win.removeMenu();
    await win.loadFile(paths.renderFilePath);
  } else {
    await win.loadURL(viteServerUrl);
  }

  return win;
};

export const openUrlExternal = (url: string) => {
  const parsedUrl = new URL(url);
  if (allowedExternalUrls.has(parsedUrl.origin)) {
    log.debug(`${url} is opened externally.`);
    setImmediate(async () => {
      await shell.openExternal(url);
    });
  }
};

const defaults = {
  createWindow,
  openUrlExternal,
};

export default defaults;
