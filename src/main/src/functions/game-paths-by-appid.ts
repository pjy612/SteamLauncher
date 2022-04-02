import {
  join,
} from 'node:path';
import {
  app,
} from 'electron';

const gamePathsByAppId = (appId: string) => {
  const userData = app.getPath('userData');

  const dataPath = join(userData, 'data');
  const appsPath = join(dataPath, 'apps');

  const appIdDataPath = join(appsPath, appId);
  const appIdAchievementsPath = join(appIdDataPath, 'achievements');
  const appIdAchievementsInfoPath = join(appIdDataPath, 'achievements.json');
  const appIdStatsInfoPath = join(appIdDataPath, 'stats.txt');
  const appIdItemsInfoPath = join(appIdDataPath, 'items.json');
  const appIdDefaultItemsInfoPath = join(appIdDataPath, 'default_items.json');
  const appIdDlcsInfoPath = join(appIdDataPath, 'DLC.txt');
  const appIdSteamInterfacesPath = join(appIdDataPath, 'steam_interfaces.txt');
  const appIdHeaderPath = join(appIdDataPath, 'header.jpg');

  return {
    appIdAchievementsInfoPath,
    appIdAchievementsPath,
    appIdDataPath,
    appIdDefaultItemsInfoPath,
    appIdDlcsInfoPath,
    appIdHeaderPath,
    appIdItemsInfoPath,
    appIdStatsInfoPath,
    appIdSteamInterfacesPath,
  };
};

export default gamePathsByAppId;
