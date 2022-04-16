import { parse } from 'node:path';
import { app, ipcMain as ipc, dialog } from 'electron';
import MarkDownIt from 'markdown-it';
// eslint-disable-next-line node/no-missing-import
import readme from '../../../../README.md?raw';
import { author as packageAuthor } from '../../../../package.json';
import getCurrentWindow from '../functions/get-current-window';
import notify from '../functions/notify';

const markdown = new MarkDownIt({
  html: true,
  linkify: true,
});

ipc.handle('app-get-version', () => {
  return app.getVersion();
});

ipc.handle('app-get-name', () => {
  return app.getName();
});

ipc.handle('app-get-description', () => {
  return markdown.render(readme);
});

ipc.handle('app-get-copyright', () => {
  return `Copyright © ${new Date().getUTCFullYear()} ${packageAuthor.name}`;
});

ipc.handle('app-notify', (_event, message: string) => {
  notify(message);
});

ipc.handle('app-file-path-parse', (_event, filePath: string) => {
  return {
    ...parse(filePath),
    fullPath: filePath,
  };
});

ipc.handle('app-chose-directory', (event) => {
  return dialog.showOpenDialog(getCurrentWindow(event)!, {
    properties: ['openDirectory'],
  });
});

ipc.handle('app-chose-file', (event) => {
  return dialog.showOpenDialog(getCurrentWindow(event)!, {
    properties: ['openFile'],
  });
});
