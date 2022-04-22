import { app, ipcMain as ipc, dialog } from 'electron';
import { parse } from 'node:path';

import MarkDownIt from 'markdown-it';

import readme from '../../../../README.md?raw';
import { author as packageAuthor } from '../../../../package.json';
import getCurrentWindow from '../functions/get-current-window';
import notify from '../functions/notify';

const markdown = new MarkDownIt({
  html: true,
  linkify: true,
});

ipc.handle('app-get-version', () => app.getVersion());

ipc.handle('app-get-name', () => app.getName());

ipc.handle('app-get-description', () => markdown.render(readme));

ipc.handle(
  'app-get-copyright',
  () => `Copyright © ${new Date().getUTCFullYear()} ${packageAuthor.name}`
);

ipc.handle('app-notify', (_event, message: string) => {
  notify(message);
});

ipc.handle('app-file-path-parse', (_event, filePath: string) => ({
  ...parse(filePath),
  fullPath: filePath,
}));

ipc.handle('app-chose-directory', (event) =>
  dialog.showOpenDialog(getCurrentWindow(event)!, {
    properties: ['openDirectory'],
  })
);

ipc.handle('app-chose-file', (event) =>
  dialog.showOpenDialog(getCurrentWindow(event)!, {
    properties: ['openFile'],
  })
);
