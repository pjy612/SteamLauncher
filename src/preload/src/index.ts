import { contextBridge, ipcRenderer as ipc } from 'electron';

const api: WindowApiType = {
  on(channel, listener) {
    ipc.on(channel, listener);
  },
  send(channel, ...arguments_) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ipc.send(channel, ...arguments_);
  },
  account: {
    exist() {
      return ipc.invoke('account-exist');
    },
    getData() {
      return ipc.invoke('account-data');
    },
    getRandomSteamId() {
      return ipc.invoke('account-get-random-steamid');
    },
  },
  app: {
    choseDirectory() {
      return ipc.invoke('app-chose-directory');
    },
    choseFile() {
      return ipc.invoke('app-chose-file');
    },
    filePathParse(path) {
      return ipc.invoke('app-file-path-parse', path);
    },
    getCopyright() {
      return ipc.invoke('app-get-copyright');
    },
    getDescription() {
      return ipc.invoke('app-get-description');
    },
    getName() {
      return ipc.invoke('app-get-name');
    },
    getVersion() {
      return ipc.invoke('app-get-version');
    },
    openLudusavi() {
      ipc.send('app-open-ludusavi');
    },
    handlebarsGenerate(template, context) {
      return ipc.invoke('app-handlebars-generate', template, context);
    },
    notify(message) {
      ipc.send('app-notify', message);
    },
  },
  game: {
    getData(appId) {
      return ipc.invoke('game-data', appId);
    },
    openContextMenu(appId) {
      ipc.send('game-contextmenu', appId);
    },
  },
  games: {
    getData() {
      return ipc.invoke('games-data');
    },
  },
  settings: {
    getData() {
      return ipc.invoke('settings-data');
    },
    getNetworkStatus() {
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
