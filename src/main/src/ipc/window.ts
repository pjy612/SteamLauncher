import { ipcMain as ipc } from 'electron';

import getCurrentWindow from '../functions/get-current-window';

ipc.handle('window-close', (event) => {
  getCurrentWindow(event)?.close();
});

ipc.handle('window-minimize', (event) => {
  getCurrentWindow(event)?.minimize();
});

ipc.handle('window-maximize', (event) => {
  getCurrentWindow(event)?.maximize();
});

ipc.handle('window-restore', (event) => {
  getCurrentWindow(event)?.restore();
});
