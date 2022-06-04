import { app, ipcMain as ipc, dialog } from 'electron';
import { parse } from 'node:path';
import MarkDownIt from 'markdown-it';
import readme from '../../../../README.md?raw';
import { author as packageAuthor } from '../../../../package.json';
import appNotify from '../functions/app-notify';
import { getWindow } from '../functions/app-window';
import paths from '../configs/paths';
import handlebars from '../instances/handlebars';
import appExec from '../functions/app-exec';

const appGetVersion = app.getVersion();
ipc.handle('app-get-version', () => appGetVersion);

const appGetName = app.getName();
ipc.handle('app-get-name', () => appGetName);

const markdown = new MarkDownIt({
  html: true,
  linkify: true,
});
const markdownReadmeRendered = markdown.render(readme);
ipc.handle('app-get-description', () => markdownReadmeRendered);

const appGetCopyright = `Copyright © ${new Date().getUTCFullYear()} ${packageAuthor.name}`;
ipc.handle('app-get-copyright', () => appGetCopyright);

ipc.on('app-notify', (_event, message: string) => appNotify(message));

ipc.handle('app-file-path-parse', (_event, filePath: string) => ({
  ...parse(filePath),
  fullPath: filePath,
}));

ipc.handle('app-chose-directory', () =>
  dialog.showOpenDialog(getWindow()!, {
    properties: ['openDirectory'],
  })
);

ipc.handle('app-chose-file', () =>
  dialog.showOpenDialog(getWindow()!, {
    properties: ['openFile'],
  })
);

ipc.on('app-open-ludusavi', async () => {
  await appExec(paths.ludusavi.filePath, [], paths.ludusavi.rootPath);
});

ipc.handle('app-handlebars-generate', (_event, template: string, context: Record<string, string> = {}) => {
  const compile = handlebars.compile(template);
  return compile(context);
});
