import { BrowserWindow, Rectangle, shell } from 'electron';
import allowedExternalUrls from '../configs/allowed-external-urls';
// eslint-disable-next-line import/no-cycle
import storage from '../instances/storage';
import paths from '../configs/paths';

let createdWindow: BrowserWindow | undefined;

const stateChangeHandler = (win: BrowserWindow) => {
  storage.set('window.bounds', win.getBounds());
  storage.set('window.isMaximized', win.isMaximized());
  storage.set('window.isFullScreen', win.isFullScreen());
};

export const getWindow = () => createdWindow;

export const openUrlExternallyWindow = (url: string) => {
  const parsedUrl = new URL(url);
  if (allowedExternalUrls.has(parsedUrl.hostname)) {
    setImmediate(async () => {
      await shell.openExternal(url);
    });
  }
};

export const createWindow = async () => {
  const padding = 10;
  const widthWindow = 1000 + padding;
  const heightWindow = 720 + padding;

  createdWindow = new BrowserWindow({
    width: widthWindow,
    minWidth: widthWindow,
    height: heightWindow,
    minHeight: heightWindow,
    show: false,
    frame: import.meta.env.DEV,
    webPreferences: {
      // SECURITY: disable devtools in production mode
      devTools: import.meta.env.DEV,
      preload: paths.files.preloadFilePath,
      // NOTE: local files are not displayed in developer mode
      webSecurity: import.meta.env.PROD,
    },
  });

  createdWindow.on('ready-to-show', () => {
    createdWindow?.show();

    const windowIsMaximized = storage.get('window.isMaximized', false);
    if (windowIsMaximized) {
      createdWindow?.maximize();
    }

    const windowIsFullScreen = storage.get('window.isFullScreen', false);
    if (windowIsFullScreen) {
      createdWindow?.setFullScreen(true);
    }

    const windowBounds = storage.get('window.bounds');
    if (typeof windowBounds !== 'undefined' && createdWindow?.isNormal()) {
      createdWindow.setBounds(windowBounds as Partial<Rectangle>);
    }
  });

  const windowStateChangeName = 'window-state-change';

  createdWindow.on('resized', () => {
    stateChangeHandler(createdWindow!);
  });

  createdWindow.on('moved', () => {
    stateChangeHandler(createdWindow!);
  });

  createdWindow.on('close', () => {
    stateChangeHandler(createdWindow!);
  });

  createdWindow.on('maximize', () => {
    stateChangeHandler(createdWindow!);
    createdWindow?.webContents.send(windowStateChangeName, true);
  });

  createdWindow.on('unmaximize', () => {
    stateChangeHandler(createdWindow!);
    createdWindow?.webContents.send(windowStateChangeName, false);
  });

  createdWindow.webContents.on('did-finish-load', () => {
    createdWindow?.webContents.send(windowStateChangeName, createdWindow.isMaximized());
  });

  if (import.meta.env.PROD) {
    createdWindow.removeMenu();
    await createdWindow.loadFile(paths.files.renderFilePath);
  } else {
    const viteServerUrl = 'http://localhost:3000/';

    await createdWindow.loadURL(viteServerUrl);
  }

  createdWindow.webContents.openDevTools({
    mode: 'undocked',
  });

  return createdWindow;
};
