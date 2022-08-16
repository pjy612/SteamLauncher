import { app, ipcMain as ipc, dialog } from 'electron';
import { parse } from 'node:path';
import readme from '../../../README.md?raw';
import { copyright as packageCopyright } from '../../../package.json';
import paths from '../configs/paths';
import appGetWindow from '../functions/app-get-window';
import appNotify from '../functions/app-notify';
import appExec from '../functions/app-exec';
import handlebars from '../instances/handlebars';
import markdown from '../instances/markdown';

ipc.on('app-notify', (_event, message: string) => appNotify(message));

ipc.on('app-open-ludusavi', () => appExec(paths.ludusavi.filePath, [], paths.ludusavi.rootPath));

ipc.handle('app-get-version', () => app.getVersion());

ipc.handle('app-get-name', () => app.getName());

const readmeMdRendered = markdown.render(readme);
ipc.handle('app-get-description', () => readmeMdRendered);

ipc.handle('app-get-copyright', () => packageCopyright);

ipc.handle(
  'app-file-path-parse',
  (_event, filePath: string): FilePathInfoType => ({
    ...parse(filePath),
    fullPath: filePath,
  })
);

ipc.handle('app-chose-directory', async () => {
  const appWindow = appGetWindow();
  if (typeof appWindow !== 'undefined') {
    await dialog.showOpenDialog(appWindow, {
      properties: ['openDirectory'],
    });
  }
});

ipc.handle('app-chose-file', async () => {
  const appWindow = appGetWindow();
  if (typeof appWindow !== 'undefined') {
    await dialog.showOpenDialog(appWindow, {
      properties: ['openFile'],
    });
  }
});

ipc.handle('app-handlebars-generate', (_event, template, context) => handlebars.compile(template)(context));
