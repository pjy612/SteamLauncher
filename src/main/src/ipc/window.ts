import { ipcMain as ipc } from 'electron';
import { appGetWindow } from '../functions/app-window';

ipc.on('window-close', () => {
  const window = appGetWindow();
  if (typeof window !== 'undefined') {
    window.close();
  }
});

ipc.on('window-minimize', () => {
  const window = appGetWindow();
  if (typeof window !== 'undefined') {
    window.minimize();
  }
});

ipc.on('window-maximize', () => {
  const window = appGetWindow();
  if (typeof window !== 'undefined') {
    window.maximize();
  }
});

ipc.on('window-restore', () => {
  const window = appGetWindow();
  if (typeof window !== 'undefined') {
    window.restore();
  }
});
