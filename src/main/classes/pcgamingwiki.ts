import logger from '@main/instances/logger';
import axios from '@main/instances/axios-cache';

class PCGamingWikiApi {
  public static async getName(appId: string) {
    try {
      const url = `https://www.pcgamingwiki.com/w/index.php?title=Special:CargoExport&tables=Infobox_game&where=Infobox_game.Steam_AppID+HOLDS+${appId}&format=json`;
      const response = await axios.get(url, { id: `pcgamingwikiapi_${appId}` });
      const responseData = response.data as PCGamingWikiApiType;
      // eslint-disable-next-line no-underscore-dangle
      return responseData.length > 0 ? responseData[0]._pageName : undefined;
    } catch (error) {
      logger.error('PCGamingWikiApi', error);
      return undefined;
    }
  }
}

export default PCGamingWikiApi;
