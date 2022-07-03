/* eslint-disable sonarjs/cognitive-complexity */
import { BrowserWindow, Rectangle, Tray, Menu, app, nativeImage } from 'electron';
import autoUpdater from '../instances/autoupdater';
import storage from '../instances/storage';
import paths from '../configs/paths';
import { appIsInstalled } from '../app';

const appCreateTray = (appWindow: BrowserWindow) => {
  const appTrayName = app.getName();
  const appTrayContextMenu = Menu.buildFromTemplate([
    {
      label: appTrayName,
      icon: nativeImage.createFromPath(paths.files.iconFilePath).resize({ width: 16 }),
      enabled: false,
    },
    {
      type: 'separator',
    },
    {
      label: 'Show',
      click() {
        appWindow.show();
      },
    },
    {
      label: 'Exit',
      click() {
        appWindow.close();
      },
    },
  ]);

  const appTray = new Tray(paths.files.iconFilePath);
  appTray.on('click', () => {
    appWindow.show();
  });
  appTray.setToolTip(appTrayName);
  appTray.setContextMenu(appTrayContextMenu);

  return appTray;
};

const windowStateChangeHandler = (appWindow: BrowserWindow) => {
  storage.set('window.bounds', appWindow.getBounds());
  storage.set('window.isMaximized', appWindow.isMaximized());
  storage.set('window.isFullScreen', appWindow.isFullScreen());
};

const appCreateWindow = async () => {
  const padding = 10;
  const widthWindow = 1000 + padding;
  const heightWindow = 720 + padding;

  const appWindow = new BrowserWindow({
    width: widthWindow,
    minWidth: widthWindow,
    height: heightWindow,
    minHeight: heightWindow,
    icon: paths.files.iconFilePath,
    backgroundColor: '#161920',
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

  appWindow.on('ready-to-show', () => {
    appWindow.show();

    const windowIsMaximized = storage.get('window.isMaximized', false);
    if (windowIsMaximized) {
      appWindow.maximize();
    }

    const windowIsFullScreen = storage.get('window.isFullScreen', false);
    if (windowIsFullScreen) {
      appWindow.setFullScreen(true);
    }

    const windowBounds = storage.get('window.bounds');
    if (typeof windowBounds !== 'undefined' && appWindow.isNormal()) {
      appWindow.setBounds(windowBounds as Partial<Rectangle>);
    }
  });

  let appTray: Tray | undefined;
  appWindow.on('minimize', () => {
    const minimizeToTray = storage.get('settings.minimizeToTray', true);
    if (minimizeToTray) {
      appWindow.setSkipTaskbar(true);
      appTray = appCreateTray(appWindow);
    }
  });

  appWindow.on('restore', () => {
    const minimizeToTray = storage.get('settings.minimizeToTray', true);
    if (minimizeToTray) {
      appWindow.setSkipTaskbar(false);
      if (typeof appTray !== 'undefined') {
        appTray.destroy();
      }
    }
  });

  const windowStateChangeName = 'window-state-change';

  appWindow.on('resized', () => {
    windowStateChangeHandler(appWindow);
  });

  appWindow.on('moved', () => {
    windowStateChangeHandler(appWindow);
  });

  appWindow.on('close', () => {
    windowStateChangeHandler(appWindow);
  });

  appWindow.on('maximize', () => {
    windowStateChangeHandler(appWindow);
    appWindow.webContents.send(windowStateChangeName, true);
  });

  appWindow.on('unmaximize', () => {
    windowStateChangeHandler(appWindow);
    appWindow.webContents.send(windowStateChangeName, false);
  });

  appWindow.webContents.on('did-finish-load', () => {
    appWindow.webContents.send(windowStateChangeName, appWindow.isMaximized());
  });

  if (import.meta.env.PROD) {
    appWindow.removeMenu();
    await appWindow.loadFile(paths.files.renderFilePath);
  } else {
    await appWindow.loadURL('http://localhost:3000/');
  }

  appWindow.webContents.openDevTools({
    mode: 'undocked',
  });

  if (appIsInstalled) {
    await autoUpdater.checkForUpdates();
  }

  return appWindow;
};

export default appCreateWindow;
