import util from 'node:util';
import logger from '../instances/logger';
import axios from '../instances/axios-cache';

class PCGamingWikiApi {
  public static async getName(appId: string) {
    try {
      const url = `https://www.pcgamingwiki.com/w/index.php?title=Special:CargoExport&tables=Infobox_game&where=Infobox_game.Steam_AppID+HOLDS+${appId}&format=json`;
      const response = await axios.get(url, { id: `pcgamingwikiapi_${appId}` });
      const responseData = response.data as PCGamingWikiApiType;
      return responseData.length > 0 ? responseData[0]._pageName : '';
    } catch (error) {
      logger.error(util.format('PCGamingWikiApi:', error));
      return '';
    }
  }
}

export default PCGamingWikiApi;
