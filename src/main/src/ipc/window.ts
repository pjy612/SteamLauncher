import { ipcMain as ipc } from 'electron';
import { getWindow } from '../functions/window';

ipc.on('window-close', () => {
  getWindow()?.close();
});

ipc.on('window-minimize', () => {
  getWindow()?.minimize();
});

ipc.on('window-maximize', () => {
  getWindow()?.maximize();
});

ipc.on('window-restore', () => {
  getWindow()?.restore();
});
