import { app, BrowserWindow, Rectangle, shell } from 'electron';
import { allowedExternalUrls } from '../config';
import storage from '../instances/storage';
import paths from '../paths';

const stateChangeHandler = (win: BrowserWindow) => {
  storage.set('window.bounds', win.getBounds());
  storage.set('window.isMaximized', win.isMaximized());
  storage.set('window.isFullScreen', win.isFullScreen());
};

let createdWindow: BrowserWindow | undefined;

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
  createdWindow = new BrowserWindow({
    backgroundColor: '#161920',
    frame: import.meta.env.DEV,
    height: 720,
    icon: paths.files.iconFilePath,
    minHeight: 720,
    minWidth: 800,
    show: false,
    title: app.getName(),
    webPreferences: {
      // SECURITY: disable devtools in production mode
      devTools: import.meta.env.DEV,
      preload: paths.files.preloadFilePath,
      // NOTE: local files are not displayed in developer mode
      webSecurity: import.meta.env.PROD,
    },
    width: 800,
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
