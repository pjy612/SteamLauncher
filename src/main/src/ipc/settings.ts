import { ipcMain as ipc } from 'electron';
import appModalsHide from '../functions/app-modals-hide';
import appNotify from '../functions/app-notify';
import storage from '../instances/storage';

ipc.on('settings-edit', (_event, inputs: StoreSettingsType) => {
  appNotify('Settings edited successfully!');
  storage.set('settings', inputs);
  appModalsHide();
});

ipc.handle('settings-data', () => storage.get('settings'));

ipc.on('settings-set-network', (_event, data: string) => {
  storage.set('settings.network', data === 'online');
});

ipc.handle('settings-get-network-status', () => (storage.get('settings.network', true) ? 'online' : 'offline'));
