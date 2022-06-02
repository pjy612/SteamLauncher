import type { IpcRendererEvent, OpenDialogReturnValue } from 'electron';

type ApiGameGetPaths = {
  appsPath: string;
  appIdSavesPath: string;
  appIdAchievementsInfoPath: string;
  appIdAchievementsPath: string;
  appIdDataPath: string;
  appIdDefaultItemsInfoPath: string;
  appIdDlcsInfoPath: string;
  appIdHeaderPath: string;
  appIdItemsInfoPath: string;
  appIdStatsInfoPath: string;
  appIdSteamInterfacesPath: string;
};

declare global {
  interface Window {
    $: JQueryStatic;
    jQuery: JQueryStatic;
    api: {
      account: {
        exist: () => Promise<boolean>;
        getData: () => Promise<StoreAccountType | undefined>;
        getRandomSteamId: () => Promise<string>;
      };
      app: {
        choseDirectory: () => Promise<OpenDialogReturnValue>;
        choseFile: () => Promise<OpenDialogReturnValue>;
        filePathParse: (path: string) => Promise<FilePathParse>;
        getCopyright: () => Promise<string>;
        getDescription: () => Promise<string>;
        getName: () => Promise<string>;
        getVersion: () => Promise<string>;
        openLudusavi: () => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handlebarsGenerate: (template: string, context: Record<string, any> = {}) => Promise<string>;
        notify: (message: string) => void;
      };
      game: {
        getData: (appId: string) => Promise<StoreGameDataType | undefined>;
        getPaths: (appId: string) => Promise<ApiGameGetPaths>;
        openContextMenu: (appId: string) => void;
      };
      games: {
        getData: () => Promise<StoreGamesDataType | undefined>;
      };
      on: (
        channel: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        listener: (event: IpcRendererEvent, ...arguments_: any[]) => void
      ) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send: (channel: string, ...arguments_: any[]) => void;
      settings: {
        getData: () => Promise<StoreSettingsType>;
        getNetworkStatus: () => Promise<string>;
        setNetworkStatus: (to: string) => void;
      };
      window: {
        close: () => void;
        maximize: () => void;
        minimize: () => void;
        restore: () => void;
      };
    };
  }
}
