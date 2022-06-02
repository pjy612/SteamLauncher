import type { IpcMainEvent } from 'electron';
import { ipcMain as ipc } from 'electron';
import { customAlphabet } from 'nanoid/non-secure';
import { fromIndividualAccountID } from 'steamid';
import appModalsHide from '../functions/app-modals-hide';
import appNotify from '../functions/app-notify';
import storage from '../instances/storage';

const functionAccountCreateEdit = (_event: IpcMainEvent, inputs: StoreAccountType) => {
  if (!fromIndividualAccountID(inputs.steamId).isValidIndividual()) {
    appNotify(`Invalid ${inputs.steamId} SteamId!`);
    return;
  }

  appNotify(storage.has('account') ? 'Account edited successfully!' : 'Account created successfully!');
  storage.set('account', inputs);
  appModalsHide();
};

ipc.on('account-create', functionAccountCreateEdit);
ipc.on('account-edit', functionAccountCreateEdit);

ipc.handle('account-data', () => storage.get('account'));

ipc.handle('account-exist', () => storage.has('account'));

ipc.handle('account-get-random-steamid', () => {
  const nanoid = customAlphabet('0123456789', 8);
  return fromIndividualAccountID(nanoid()).getSteamID64();
});
