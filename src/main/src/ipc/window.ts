import { ipcMain as ipc } from 'electron';
import { getWindow } from '../functions/window';

ipc.handle('window-close', () => {
  getWindow()?.close();
});

ipc.handle('window-minimize', () => {
  getWindow()?.minimize();
});

ipc.handle('window-maximize', () => {
  getWindow()?.maximize();
});

ipc.handle('window-restore', () => {
  getWindow()?.restore();
});
