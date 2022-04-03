import ElectronStore from 'electron-store';

const storage = new ElectronStore<StoreType>({
  defaults: {
    settings: {
      httpsRejectUnauthorized: true,
      network: true,
    },
  },
  migrations: {
    '0.1.2': (store) => {
      store.set('settings.httpsRejectUnauthorized', true);
    },
  },
});

export default storage;
