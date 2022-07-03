import type Conf from 'conf';

const migration012 = {
  '0.1.2': (store: Conf<StoreType>) => {
    store.set('settings.httpsRejectUnauthorized', true);
  },
};

const migration019 = {
  '0.1.9': (store: Conf<StoreType>) => {
    const games = store.get('games');

    if (typeof games !== 'undefined') {
      for (const index in games) {
        if (Object.hasOwn(games, index)) {
          const game = games[index];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { appId, path, runPath, overlay } = game;

          game.executableFilePath = path as string;
          game.executableWorkingDirectory = runPath as string;
          game.disableOverlay = overlay as boolean;

          game.disableNetworking = false;
          game.disableLanOnly = false;

          game.forceAccountName = '';
          game.forceAccountLanguage = '';
          game.forceAccountSteamId = '';
          game.forceAccountListenPort = '';

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete game.path;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete game.runPath;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete game.overlay;

          store.set(`games.${appId}`, game);
        }
      }
    }
  },
};

const migration020 = {
  '0.2.0': (store: Conf<StoreType>) => {
    store.set('settings.ssePersist', false);
    store.set('settings.sseInjectDll', false);
    store.set('settings.sseParanoidMode', false);
  },
};

const migration021 = {
  '0.2.1': (store: Conf<StoreType>) => {
    store.set('settings.emulatorUpdater', true);
  },
};

const migration024 = {
  '0.2.4': (store: Conf<StoreType>) => {
    store.set('settings.minimizeToTray', true);
    store.set('settings.minimizeToTrayWhenLaunchGame', true);
  },
};

export default {
  ...migration012,
  ...migration019,
  ...migration020,
  ...migration021,
  ...migration024,
};
