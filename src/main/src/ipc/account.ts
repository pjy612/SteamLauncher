import type { IpcMainEvent } from 'electron';
import { ipcMain as ipc } from 'electron';

import { customAlphabet } from 'nanoid/non-secure';
import { fromIndividualAccountID } from 'steamid';

import notify from '../functions/notify';
import storage from '../instances/storage';

const functionAccountCreateEdit = (event: IpcMainEvent, inputs: StoreAccountType) => {
  if (!fromIndividualAccountID(inputs.steamId).isValidIndividual()) {
    notify(`Invalid ${inputs.steamId} SteamId!`);
    return;
  }

  storage.set('account', inputs);
  notify(storage.has('account') ? 'Account edited successfully!' : 'Account created successfully!');
  event.sender.send('modal-hide');
};

ipc.on('account-create', functionAccountCreateEdit);
ipc.on('account-edit', functionAccountCreateEdit);

ipc.handle('account-data', () => storage.get('account'));

ipc.handle('account-exist', () => storage.has('account'));

ipc.handle('account-get-random-steamid', () => {
  const nanoid = customAlphabet('0123456789', 8);
  return fromIndividualAccountID(nanoid()).getSteamID64();
});
