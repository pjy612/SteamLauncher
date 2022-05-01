import { ipcMain as ipc } from 'electron';
import notify from '../functions/notify';
import storage from '../instances/storage';

ipc.on('settings-edit', (event, inputs: StoreSettingsType) => {
  storage.set('settings', inputs);
  notify('Settings edited successfully!');
  event.sender.send('modal-hide');
});

ipc.on('settings-set-network', (_event, data: boolean) => {
  storage.set('settings.network', data);
});

ipc.handle('settings-get-network-status', (): boolean => storage.get('settings.network'));

ipc.handle('settings-data', () => storage.get('settings'));
