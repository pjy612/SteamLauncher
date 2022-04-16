type SteamRetrieverGameData = {
  name: string;
};

// https://store.steampowered.com/api/appdetails/?appids=252490&filters=basic
type SteamRetrieverAppDetailsData = {
  type: string;
};

type SteamRetrieverAppDetailsInfo = {
  success: boolean;
  data: SteamRetrieverAppDetailsData;
};

type SteamRetrieverAppDetails = Record<string, SteamRetrieverAppDetailsInfo>;

// https://store.steampowered.com/api/dlcforapp/?appid=252490
type SteamRetrieverDlcForAppDLC = {
  id: number;
  name: string;
};

type SteamRetrieverDlcForApp = {
  status: number;
  name: string;
  dlc: SteamRetrieverDlcForAppDLC[];
};

// https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=_WEBAPIKEY_&l=en&appid=252490
type SteamRetrieverGetSchemaForGameStat = {
  name: string;
  defaultvalue: number;
  displayName: string;
};

type SteamRetrieverGetSchemaForGameAchievement = {
  name: string;
  icon: string;
  icongray: string;
};

type SteamRetrieverGetSchemaForGameAvailableGameStats = {
  stats?: SteamRetrieverGetSchemaForGameStat[];
  achievements?: SteamRetrieverGetSchemaForGameAchievement[];
};

type SteamRetrieverGetSchemaForGameGame = {
  availableGameStats: SteamRetrieverGetSchemaForGameAvailableGameStats;
};

type SteamRetrieverGetSchemaForGame = {
  game: SteamRetrieverGetSchemaForGameGame;
};

// https://api.steampowered.com/IInventoryService/GetItemDefMeta/v1/?key=_WEBAPIKEY_&appid=252490
// eslint-disable-next-line unicorn/prevent-abbreviations
type SteamRetrieverGetItemDefMetaResponse = {
  modified: number;
  digest: string;
};

// eslint-disable-next-line unicorn/prevent-abbreviations
type SteamRetrieverGetItemDefMeta = {
  response: SteamRetrieverGetItemDefMetaResponse;
};

// https://api.steampowered.com/IGameInventory/GetItemDefArchive/v1/?digest=__DIGEST__&appid=252490
// eslint-disable-next-line unicorn/prevent-abbreviations
type SteamRetrieverGetItemDefArchiveResponse = {
  itemdefid: string;
};

// eslint-disable-next-line unicorn/prevent-abbreviations
type SteamRetrieverGetItemDefArchive = SteamRetrieverGetItemDefArchiveResponse[];
