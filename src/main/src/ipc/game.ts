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
  if (storage.has(key)) {
    appNotify('Game edited successfully!');

    storage.set(`${key}.appId`, inputs.appId);
    storage.set(`${key}.executableFilePath`, inputs.executableFilePath);
    storage.set(`${key}.executableWorkingDirectory`, inputs.executableWorkingDirectory);
    storage.set(`${key}.commandLine`, inputs.commandLine);

    storage.set(`${key}.disableNetworking`, inputs.disableNetworking);
    storage.set(`${key}.disableOverlay`, inputs.disableOverlay);
    storage.set(`${key}.disableLanOnly`, inputs.disableLanOnly);

    storage.set(`${key}.forceAccountName`, inputs.forceAccountName);
    storage.set(`${key}.forceAccountLanguage`, inputs.forceAccountLanguage);
    storage.set(`${key}.forceAccountSteamId`, inputs.forceAccountSteamId);
    storage.set(`${key}.forceAccountListenPort`, inputs.forceAccountListenPort);

    appModalsHide();
  } else {
    const steamRetriever = new SteamRetriever(inputs);
    await steamRetriever.run();
  }
};

ipc.on('game-add', functionGameAddEdit);
ipc.on('game-edit', functionGameAddEdit);

ipc.on('game-contextmenu', (event, appId: string) => {
  const dataGame = SteamGame.getData(appId);
  if (typeof dataGame !== 'undefined') {
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
          SteamGame.createDesktopShortcut(dataGame);
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Open file location',
        async click() {
          await SteamGame.openFileLocation(dataGame);
        },
      },
      {
        label: 'Open saves location',
        async click() {
          await SteamGame.openSavesLocation(dataGame);
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
          await SteamGame.openDataLocation(dataGame);
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
  }
});

ipc.handle('game-data', (_event, appId: string) => SteamGame.getData(appId));

ipc.handle('games-data', () => SteamGame.getAllData());
