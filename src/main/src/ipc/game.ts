import type { IpcMainEvent } from 'electron';
import { ipcMain as ipc, Menu } from 'electron';
import Game from '../classes/game';
import SteamRetriever from '../classes/steam-retriever';
import notify from '../functions/notify';
import promptYesNo from '../functions/prompt-yes-no';
import storage from '../instances/storage';

const functionGameAddEdit = async (event: IpcMainEvent, inputs: StoreGameDataType) => {
  const key = `games.${inputs.appId}`;
  const data: StoreGameDataType | undefined = storage.get(key);
  if (typeof data !== 'undefined') {
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
  return Game.paths(appId);
});

ipc.handle('game-data', (_event, appId: string): StoreGameDataType | undefined => {
  return storage.get(`games.${appId}`);
});

ipc.handle('games-data', () => {
  return storage.get('games');
});

ipc.on('game-contextmenu', (event, appId: string) => {
  const data: StoreGameDataType = storage.get(`games.${appId}`);
  const menu = Menu.buildFromTemplate([
    {
      label: 'Launch',
      async click() {
        await Game.launch(data);
      },
    },
    {
      label: 'Launch normally',
      async click() {
        await Game.launch(data, true);
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Create desktop shortcut',
      click() {
        Game.createDesktopShortcut(appId);
      },
    },
    {
      label: 'Open file location',
      async click() {
        await Game.openFileLocation(appId);
      },
    },
    {
      label: 'Open save location',
      async click() {
        await Game.openSaveLocation(appId);
      },
    },
    {
      label: 'Open data location',
      async click() {
        await Game.openDataLocation(appId);
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Rebase DLCs, Items, etc...',
      async click() {
        if (await promptYesNo('Are you sure? The data will be overwritten!')) {
          const steamRetriever = new SteamRetriever(data);
          await steamRetriever.run();
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Edit game',
      click() {
        event.sender.send('app-navigate-to', `/game/edit/${appId}`);
      },
    },
    {
      label: 'Remove game',
      async click() {
        if (await promptYesNo('Are you sure you want to remove the game?')) {
          Game.remove(appId);
        }
      },
    },
  ]);

  menu.popup();
});
