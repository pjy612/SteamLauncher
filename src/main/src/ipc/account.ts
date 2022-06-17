import type { IpcMainEvent } from 'electron';
import { ipcMain as ipc } from 'electron';
import { customAlphabet } from 'nanoid/non-secure';
import { fromIndividualAccountID } from 'steamid';
import appModalsHide from '../functions/app-modals-hide';
import appNotify from '../functions/app-notify';
import storage from '../instances/storage';

const functionAccountCreateEdit = (_event: IpcMainEvent, inputs: StoreAccountType) => {
  appNotify(storage.has('account') ? 'Account edited successfully!' : 'Account created successfully!');

  storage.set('account.name', inputs.name);
  storage.set('account.language', inputs.language);
  storage.set('account.steamId', inputs.steamId);
  storage.set('account.listenPort', inputs.listenPort);
  storage.set('account.steamWebApiKey', inputs.steamWebApiKey);

  appModalsHide();
};

ipc.on('account-create', functionAccountCreateEdit);
ipc.on('account-edit', functionAccountCreateEdit);

ipc.handle('account-data', () => storage.get('account'));

ipc.handle('account-exist', () => storage.has('account'));

ipc.handle('account-get-random-steamid', () => {
  // NOTE: it is probable that with size 6 the saving problem has been solved
  const nanoid = customAlphabet('0123456789', 6);
  return fromIndividualAccountID(nanoid()).getSteamID64();
});
