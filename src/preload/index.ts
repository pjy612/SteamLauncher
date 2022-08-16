import { contextBridge, ipcRenderer as ipc } from 'electron';

const api: WindowApiType = {
  on(channel, listener) {
    ipc.on(channel, listener);
  },
  send(channel, ...arguments_: unknown[]) {
    ipc.send(channel, ...arguments_);
  },
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
    async filePathParse(path) {
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
    openLudusavi() {
      ipc.send('app-open-ludusavi');
    },
    async handlebarsGenerate(template, context) {
      return ipc.invoke('app-handlebars-generate', template, context);
    },
    notify(message) {
      ipc.send('app-notify', message);
    },
  },
  game: {
    async getData(appId) {
      return ipc.invoke('game-data', appId);
    },
    openContextMenu(appId) {
      ipc.send('game-contextmenu', appId);
    },
  },
  games: {
    async getData() {
      return ipc.invoke('games-data');
    },
  },
  settings: {
    async getData() {
      return ipc.invoke('settings-data');
    },
    async getNetworkStatus() {
      return ipc.invoke('settings-get-network-status');
    },
    setNetworkStatus(to) {
      ipc.send('settings-set-network-status', to);
    },
  },
  window: {
    close() {
      ipc.send('window-close');
    },
    maximize() {
      ipc.send('window-maximize');
    },
    minimize() {
      ipc.send('window-minimize');
    },
    restore() {
      ipc.send('window-restore');
    },
  },
};

contextBridge.exposeInMainWorld('api', api);
