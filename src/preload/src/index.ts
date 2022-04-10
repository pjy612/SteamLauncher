import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer as ipc } from 'electron';

contextBridge.exposeInMainWorld('api', {
  account: {
    async exist() {
      return ipc.invoke('account-exist');
    },
    async getData() {
      return ipc.invoke('account-data');
    },
    async getRandomSteamId() {
      return ipc.invoke('account-get-random-steamid');
    },
  },
  app: {
    async choseDirectory() {
      return ipc.invoke('app-chose-directory');
    },
    async choseFile() {
      return ipc.invoke('app-chose-file');
    },
    async filePathParse(path: string) {
      return ipc.invoke('app-file-path-parse', path);
    },
    async getCopyright() {
      return ipc.invoke('app-get-copyright');
    },
    async getDescription() {
      return ipc.invoke('app-get-description');
    },
    async getName() {
      return ipc.invoke('app-get-name');
    },
    async getVersion() {
      return ipc.invoke('app-get-version');
    },
    notify(message: string) {
      ipc.invoke('app-notify', message).catch(() => {
        //
      });
    },
  },
  game: {
    async getData(appId: string) {
      return ipc.invoke('game-data', appId);
    },
    async getPaths(appId: string) {
      return ipc.invoke('game-paths-by-appid', appId);
    },
    openContextMenu(appId: string) {
      ipc.send('game-contextmenu', appId);
    },
  },
  games: {
    async getData() {
      return ipc.invoke('games-data');
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(channel: string, listener: (event: IpcRendererEvent, ...arguments_: any[]) => void) {
    ipc.on(channel, listener);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(channel: string, ...arguments_: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ipc.send(channel, ...arguments_);
  },
  settings: {
    async getData() {
      return ipc.invoke('settings-data');
    },
    async getNetworkStatus() {
      return ipc.invoke('settings-get-network-status');
    },
    setNetworkStatus(to: boolean) {
      ipc.send('settings-set-network', to);
    },
  },
  window: {
    async close() {
      return ipc.invoke('window-close');
    },
    async maximize() {
      return ipc.invoke('window-maximize');
    },
    async minimize() {
      return ipc.invoke('window-minimize');
    },
    async restore() {
      return ipc.invoke('window-restore');
    },
  },
});
