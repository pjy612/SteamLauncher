import type { IpcMainEvent } from 'electron';
import { ipcMain as ipc, Menu } from 'electron';
import SteamGame from '../classes/steam-game';
import SteamCloud from '../classes/steam-cloud';
import SteamRetriever from '../classes/steam-retriever';
import appModalsHide from '../functions/app-modals-hide';
import appNotify from '../functions/app-notify';
import appPromptYesNo from '../functions/app-prompt-yes-no';
import storage from '../instances/storage';

const functionGameAddEdit = async (_event: IpcMainEvent, inputs: StoreGameDataType) => {
  const key = `games.${inputs.appId}`;
  const data: StoreGameDataType | undefined = storage.get(key);
  if (typeof data !== 'undefined') {
    storage.set(key, Object.assign(data, inputs));
    appNotify('Game edited successfully!');
    appModalsHide();
  } else {
    const steamRetriever = new SteamRetriever(inputs);
    await steamRetriever.run();
  }
};

ipc.on('game-add', functionGameAddEdit);
ipc.on('game-edit', functionGameAddEdit);

ipc.handle('game-paths', (_event, appId: string) => SteamGame.paths(appId));

ipc.handle('game-data', (_event, appId: string): StoreGameDataType | undefined => storage.get(`games.${appId}`));

ipc.handle('games-data', () => storage.get('games'));

ipc.on('game-contextmenu', (event, appId: string) => {
  const dataGame: StoreGameDataType = storage.get(`games.${appId}`);
  const menu = Menu.buildFromTemplate([
    {
      label: 'Launch',
      async click() {
        await SteamGame.launch(dataGame);
      },
    },
    {
      label: 'Launch without emulator',
      async click() {
        await SteamGame.launch(dataGame, true);
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Create desktop shortcut',
      click() {
        SteamGame.createDesktopShortcut(appId);
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Open file location',
      async click() {
        await SteamGame.openFileLocation(appId);
      },
    },
    {
      label: 'Open saves location',
      async click() {
        await SteamGame.openSavesLocation(appId);
      },
    },
    {
      label: 'Open cloud saves location',
      click() {
        SteamGame.openCloudSavesLocation();
      },
    },
    {
      label: 'Open data location',
      async click() {
        await SteamGame.openDataLocation(appId);
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Rebase DLCs, Items, etc...',
      async click() {
        if (await appPromptYesNo('Are you sure? The data will be overwritten!')) {
          const steamRetriever = new SteamRetriever(dataGame);
          await steamRetriever.run();
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Manually backup saves to cloud',
      click() {
        SteamCloud.backup(dataGame);
      },
    },
    {
      label: 'Manually restore saves from cloud',
      click() {
        SteamCloud.restore(dataGame);
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Edit game',
      click() {
        event.sender.send('app-navigate', `/game/edit/${appId}`);
      },
    },
    {
      label: 'Remove game',
      async click() {
        if (await appPromptYesNo('Are you sure you want to remove the game?')) {
          SteamGame.remove(appId);
        }
      },
    },
  ]);

  menu.popup();
});
