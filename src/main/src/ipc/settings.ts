import { ipcMain as ipc } from 'electron';
import notify from '../functions/notify';
import storage from '../instances/storage';

ipc.on('settings-edit', (event, inputs: StoreSettingsType) => {
  storage.set('settings', inputs);
  notify('Settings edited successfully!');
  event.sender.send('app-modals-hide');
});

ipc.on('settings-set-network', (_event, data: string) => {
  storage.set('settings.network', data === 'online');
});

ipc.handle('settings-get-network-status', (): string => (storage.get('settings.network', true) ? 'online' : 'offline'));

ipc.handle('settings-data', () => storage.get('settings'));
