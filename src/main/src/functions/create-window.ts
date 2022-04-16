import { app, BrowserWindow, Rectangle } from 'electron';
import { appIsDevelopment, appIsProduction } from '../environments';
import storage from '../instances/storage';
import paths from '../paths';

const viteServerUrl = 'http://localhost:3000/';

const stateChangeHandler = (win: BrowserWindow) => {
  storage.set('window.bounds', win.getBounds());
  storage.set('window.isMaximized', win.isMaximized());
  storage.set('window.isFullScreen', win.isFullScreen());
};

const createWindow = async () => {
  const win = new BrowserWindow({
    backgroundColor: '#161920',
    frame: appIsDevelopment,
    height: 720,
    icon: paths.files.iconFile,
    minHeight: 720,
    minWidth: 800,
    show: false,
    title: app.getName(),
    webPreferences: {
      // SECURITY: disable devtools in production mode
      devTools: appIsDevelopment,
      preload: paths.files.preloadFile,
      // NOTE: local files are not displayed in developer mode
      webSecurity: appIsProduction,
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

  if (appIsProduction) {
    win.removeMenu();
    await win.loadFile(paths.files.renderFile);
  } else {
    await win.loadURL(viteServerUrl);
  }

  win.webContents.openDevTools({
    mode: 'undocked',
  });

  return win;
};

export default createWindow;
