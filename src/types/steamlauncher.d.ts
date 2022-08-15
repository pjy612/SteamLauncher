import type { IpcRendererEvent, OpenDialogReturnValue, Rectangle } from 'electron';
import type { StorageValue, MaybePromise } from 'axios-cache-interceptor';

declare global {
  interface FilePathInfoType {
    [key: string]: string;
    base: string;
    dir: string;
    ext: string;
    fullPath: string;
    name: string;
    root: string;
  }

  interface PCGamingWikiApiDataType {
    _pageName: string;
  }

  type PCGamingWikiApiType = PCGamingWikiApiDataType[];

  interface AxiosStorageType {
    [id: string]: MaybePromise<StorageValue | undefined>;
  }

  interface LudusaviErrorsType {
    someGamesFailed?: boolean;
    unknownGames?: string[];
  }

  interface LudusaviOverallType {
    totalGames: number;
    totalBytes: number;
    processedGames: number;
    processedBytes: number;
  }

  interface LudusaviGamesFilesType {
    failed: boolean;
    bytes: number;
    originalPath?: string;
    duplicatedBy: string[];
  }

  interface LudusaviGamesRegistryType {
    failed?: boolean;
    duplicatedBy?: string[];
  }

  interface LudusaviGamesType {
    decision: 'Processed' | 'Ignored' | 'Cancelled';
    files: LudusaviGamesFilesType;
    registry: LudusaviGamesRegistryType;
  }

  interface LudusaviType {
    errors?: LudusaviErrorsType;
    overall: LudusaviOverallType;
    games: LudusaviGamesType;
  }

  interface NavigareDataType {
    path: string;
    params: Record<string, string>;
  }

  type NavigareMatchType = NavigareDataType | undefined;

  type NavigareRoutesType = Record<string, (match: NavigareMatchType) => void>;

  interface SteamRetrieverGameDataType {
    name: string;
  }

  // https://store.steampowered.com/api/appdetails/?appids=252490&filters=basic
  interface SteamRetrieverAppDetailsDataType {
    type: string;
  }

  interface SteamRetrieverAppDetailsInfoType {
    success: boolean;
    data: SteamRetrieverAppDetailsDataType;
  }

  type SteamRetrieverAppDetailsType = Record<string, SteamRetrieverAppDetailsInfoType>;

  // https://store.steampowered.com/api/dlcforapp/?appid=252490
  interface SteamRetrieverDlcForAppDLCType {
    id: number;
    name: string;
  }

  interface SteamRetrieverDlcForAppType {
    status: number;
    name: string;
    dlc: SteamRetrieverDlcForAppDLCType[];
  }

  // https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=_WEBAPIKEY_&l=en&appid=252490
  interface SteamRetrieverGetSchemaForGameStatType {
    name: string;
    defaultvalue: number;
    displayName: string;
  }

  interface SteamRetrieverGetSchemaForGameAchievementType {
    name: string;
    icon: string;
    icongray: string;
  }

  interface SteamRetrieverGetSchemaForGameAvailableGameStatsType {
    stats?: SteamRetrieverGetSchemaForGameStatType[];
    achievements?: SteamRetrieverGetSchemaForGameAchievementType[];
  }

  interface SteamRetrieverGetSchemaForGameGameType {
    availableGameStats?: SteamRetrieverGetSchemaForGameAvailableGameStatsType;
  }

  interface SteamRetrieverGetSchemaForGameType {
    game: SteamRetrieverGetSchemaForGameGameType;
  }

  // https://api.steampowered.com/IInventoryService/GetItemDefMeta/v1/?key=_WEBAPIKEY_&appid=252490
  interface SteamRetrieverGetItemDefMetaResponseType {
    modified: number;
    digest: string;
  }

  interface SteamRetrieverGetItemDefMetaType {
    response: SteamRetrieverGetItemDefMetaResponseType;
  }

  // https://api.steampowered.com/IGameInventory/GetItemDefArchive/v1/?digest=__DIGEST__&appid=252490
  interface SteamRetrieverGetItemDefArchiveResponseType {
    itemdefid: string;
  }

  type SteamRetrieverGetItemDefArchiveType = SteamRetrieverGetItemDefArchiveResponseType[];

  interface StoreAccountType {
    name: string;
    language: string;
    steamId: string;
    listenPort: string;
    steamWebApiKey: string;
  }

  interface StoreGameDataPathsType {
    dataRootPath: string;
    savesRemoteRootPath: string;
    savesCloudRootPath: string | undefined;
    achievementsFilePath: string;
    achievementsRootPath: string;
    defaultItemsFilePath: string;
    dlcsFilePath: string;
    headerFilePath: string;
    itemsFilePath: string;
    statsFilePath: string;
    steamInterfacesFilePath: string;
  }

  interface StoreGameDataType {
    appId: string;
    name: string;
    pcGamingWikiName: string | undefined;
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
    paths: StoreGameDataPathsType;
  }

  type StoreGamesDataType = Record<string, StoreGameDataType>;

  interface StoreSettingsType {
    network: boolean;
    httpsRejectUnauthorized: boolean;
    minimizeToTray: boolean;
    minimizeToTrayWhenLaunchGame: boolean;
    ssePersist: boolean;
    sseInjectDll: boolean;
    sseParanoidMode: boolean;

    emulatorUpdater: boolean;
    emulatorLocalJobId?: string;
  }

  interface StoreWindowBoundsType {
    height: number;
    width: number;
    x: number;
    y: number;
  }

  interface StoreWindowType {
    bounds: Partial<Rectangle> | undefined;
    isFullScreen: boolean;
    isMaximized: boolean;
  }

  interface StoreType {
    settings: StoreSettingsType;
    window: StoreWindowType;
    account?: StoreAccountType;
    games?: StoreGamesDataType;
  }

  interface WindowApiType {
    on: (channel: string, listener: (event: IpcRendererEvent, ...args) => void) => void;
    send: (channel: string, ...args) => void;
    account: {
      exist: () => Promise<boolean>;
      getData: () => Promise<StoreAccountType | undefined>;
      getRandomSteamId: () => Promise<string>;
    };
    app: {
      choseDirectory: () => Promise<OpenDialogReturnValue>;
      choseFile: () => Promise<OpenDialogReturnValue>;
      filePathParse: (path: string) => Promise<FilePathInfoType>;
      getCopyright: () => Promise<string>;
      getDescription: () => Promise<string>;
      getName: () => Promise<string>;
      getVersion: () => Promise<string>;
      openLudusavi: () => void;
      handlebarsGenerate: (template: string, context: Record<string, unknown> = {}) => Promise<string>;
      notify: (message: string) => void;
    };
    game: {
      getData: (appId: string) => Promise<StoreGameDataType | undefined>;
      openContextMenu: (appId: string) => void;
    };
    games: {
      getData: () => Promise<StoreGamesDataType | undefined>;
    };
    settings: {
      getData: () => Promise<StoreSettingsType | undefined>;
      getNetworkStatus: () => Promise<'online' | 'offline'>;
      setNetworkStatus: (to: string) => void;
    };
    window: {
      close: () => void;
      maximize: () => void;
      minimize: () => void;
      restore: () => void;
    };
  }
}

declare global {
  interface Window {
    $: JQueryStatic;
    jQuery: JQueryStatic;
    api: WindowApiType;
  }

  interface JQuery {
    fileDrop: (callback: (file: FilePathInfoType) => void) => JQuery;
  }
}
