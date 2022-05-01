type StoreAccountType = {
  name: string;
  language: string;
  steamId: string;
  listenPort: string;
  steamWebApiKey: string;
};

type StoreGameDataType = {
  appId: string;
  name: string;
  executableFilePath: string;
  executableWorkingDirectory: string;
  commandLine: string;
  disableOverlay: boolean;
  disableNetworking: boolean;
  disableLanOnly: boolean;
  forceAccountName: string;
  forceAccountLanguage: string;
  forceAccountSteamId: string;
  forceAccountListenPort: string;
};

type StoreGamesDataType = Record<string, StoreGameDataType>;

type StoreSettingsType = {
  httpsRejectUnauthorized: boolean;
  network: boolean;
  emulatorLocalJobId?: string;
};

type StoreWindowBoundsType = {
  height: number;
  width: number;
  x: number;
  y: number;
};

type StoreWindowType = {
  bounds: StoreWindowBoundsType;
  isFullScreen: boolean;
  isMaximized: boolean;
};

type StoreType = {
  settings: StoreSettingsType;
  account?: StoreAccountType;
  games?: StoreGamesDataType;
  window?: StoreWindowType;
};
