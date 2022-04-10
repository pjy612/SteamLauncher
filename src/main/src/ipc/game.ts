import { join } from 'node:path';
import type { IpcMainEvent } from 'electron';
import { ipcMain as ipc, Menu, shell, app, dialog } from 'electron';
import { pathExists } from 'fs-extra';
import SteamRetriever from '../classes/steam-retriever';
import { paths } from '../config';
import gameLauncher from '../functions/game-launcher';
import gamePathsByAppId from '../functions/game-paths-by-appid';
import gameRemove from '../functions/game-remove';
import notify from '../functions/notify';
import storage from '../storage';

const functionGameAddEdit = async (event: IpcMainEvent, inputs: StoreGameDataType) => {
  const key = `games.${inputs.appId}`;
  if (storage.has(key)) {
    const data: StoreGameDataType = storage.get(key);
    storage.set(key, Object.assign(data, inputs));
    notify('Game edited successfully!');
    event.sender.send('modal-hide');
  } else {
    const steamRetriever = new SteamRetriever(inputs);
    await steamRetriever.run();
  }
};

ipc.on('game-add', functionGameAddEdit);
ipc.on('game-edit', functionGameAddEdit);

ipc.handle('game-paths-by-appid', (_event, appId: string) => {
  return gamePathsByAppId(appId);
});

ipc.handle('game-data', (_event, appId: string): StoreGameDataType | undefined => {
  return storage.get(`games.${appId}`);
});

ipc.handle('games-data', () => {
  return storage.get('games');
});

ipc.on('game-contextmenu', (event, appId: string) => {
  const dataGame: StoreGameDataType = storage.get(`games.${appId}`);

  Menu.buildFromTemplate([
    {
      async click() {
        await gameLauncher(dataGame);
      },
      label: 'Launch',
    },
    {
      async click() {
        await gameLauncher(dataGame, true);
      },
      label: 'Launch normally',
    },
    {
      type: 'separator',
    },
    {
      click() {
        const name = dataGame.name.replace(/[^\d .A-Za-z]/gu, '');
        const to = join(app.getPath('desktop'), `Launch ${name}.lnk`);
        const created = shell.writeShortcutLink(to, {
          args: dataGame.appId,
          icon: dataGame.path,
          iconIndex: 0,
          target: app.getPath('exe'),
        });
        if (created) {
          notify('Shortcut created successfully on desktop!');
        } else {
          notify('Unknown error with creating shortcut!');
        }
      },
      label: 'Create desktop shortcut',
    },
    {
      async click() {
        if (await pathExists(dataGame.path)) {
          shell.showItemInFolder(dataGame.path);
        } else {
          notify('The game path does not exists!');
        }
      },
      label: 'Open file location',
    },
    {
      async click() {
        const savesPath = join(paths.emulator.saves, appId);
        if (await pathExists(savesPath)) {
          await shell.openPath(savesPath);
        } else {
          notify('The game saves does not exists!');
        }
      },
      label: 'Open save location',
    },
    {
      async click() {
        const appData = gamePathsByAppId(appId).appIdDataPath;
        if (await pathExists(appData)) {
          await shell.openPath(appData);
        } else {
          notify('The game data does not exists!');
        }
      },
      label: 'Open data location',
    },
    {
      type: 'separator',
    },
    {
      async click() {
        const prompt = await dialog.showMessageBox({
          buttons: ['Yes', 'No'],
          cancelId: 1,
          defaultId: 1,
          message: 'Are you sure? The data will be overwritten!',
          type: 'warning',
        });
        if (prompt.response === 0) {
          const steamRetriever = new SteamRetriever(dataGame);
          await steamRetriever.run();
        }
      },
      label: 'Rebase DLCs, Items, etc...',
    },
    {
      type: 'separator',
    },
    {
      click() {
        event.sender.send('app-navigate-to', `/game/edit/${appId}`);
      },
      label: 'Edit game',
    },
    {
      async click() {
        const prompt = await dialog.showMessageBox({
          buttons: ['Yes', 'No'],
          cancelId: 1,
          defaultId: 1,
          message: 'Are you sure you want to remove the game?',
          type: 'warning',
        });
        if (prompt.response === 0) {
          gameRemove(appId);
        }
      },
      label: 'Remove game',
    },
  ]).popup();
});
