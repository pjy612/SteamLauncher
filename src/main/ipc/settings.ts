import { ipcMain as ipc } from 'electron';
import storageDefaults from '../configs/storage-defaults';
import appModalsHide from '../functions/app-modals-hide';
import appNotify from '../functions/app-notify';
import storage from '../instances/storage';

ipc.on('settings-edit', (_event, inputs: StoreSettingsType) => {
  appNotify('Settings edited successfully!');

  storage.set('settings.httpsRejectUnauthorized', inputs.httpsRejectUnauthorized);

  storage.set('settings.minimizeToTray', inputs.minimizeToTray);
  storage.set('settings.minimizeToTrayWhenLaunchGame', inputs.minimizeToTrayWhenLaunchGame);

  storage.set('settings.emulatorUpdater', inputs.emulatorUpdater);

  storage.set('settings.ssePersist', inputs.ssePersist);
  storage.set('settings.sseInjectDll', inputs.sseInjectDll);
  storage.set('settings.sseParanoidMode', inputs.sseParanoidMode);

  appModalsHide();
});

ipc.handle('settings-data', () => storage.get('settings'));

ipc.handle('settings-get-network-status', () =>
  storage.get('settings.network', storageDefaults.settings.network) ? 'online' : 'offline'
);

ipc.on('settings-set-network-status', (_event, data: string) => storage.set('settings.network', data === 'online'));
