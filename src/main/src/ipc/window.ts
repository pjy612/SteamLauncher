import { ipcMain as ipc } from 'electron';
import { getWindow } from '../functions/app-window';

ipc.on('window-close', () => {
  const window = getWindow();
  if (typeof window !== 'undefined') {
    window.close();
  }
});

ipc.on('window-minimize', () => {
  const window = getWindow();
  if (typeof window !== 'undefined') {
    window.minimize();
  }
});

ipc.on('window-maximize', () => {
  const window = getWindow();
  if (typeof window !== 'undefined') {
    window.maximize();
  }
});

ipc.on('window-restore', () => {
  const window = getWindow();
  if (typeof window !== 'undefined') {
    window.restore();
  }
});
