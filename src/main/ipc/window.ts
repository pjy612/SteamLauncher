import { ipcMain as ipc } from 'electron';
import appGetWindow from '../functions/app-get-window';

ipc.on('window-close', () => {
  const appWindow = appGetWindow();
  if (typeof appWindow !== 'undefined') {
    appWindow.close();
  }
});

ipc.on('window-minimize', () => {
  const appWindow = appGetWindow();
  if (typeof appWindow !== 'undefined') {
    appWindow.minimize();
  }
});

ipc.on('window-maximize', () => {
  const appWindow = appGetWindow();
  if (typeof appWindow !== 'undefined') {
    appWindow.maximize();
  }
});

ipc.on('window-restore', () => {
  const appWindow = appGetWindow();
  if (typeof appWindow !== 'undefined') {
    appWindow.restore();
  }
});
