import type { AxiosError } from 'axios';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import util from 'node:util';
import glob from 'fast-glob';
import { ensureDir, pathExists, writeFile, writeJson } from 'fs-extra';
import orgAxios from 'axios';
import axios from '../instances/axios-cache';
import logger from '../instances/logger';
import storage from '../instances/storage';
import appDownload from '../functions/app-download';
import appNotify from '../functions/app-notify';
import appSpawn from '../functions/app-spawn';
import appExec from '../functions/app-exec';
import appGetWindow from '../functions/app-get-window';
import paths from '../configs/paths';
import SteamGame from './steam-game';
import SteamCloud from './steam-cloud';

class SteamRetriever {
  private window = appGetWindow()!;
  private accountSteamWebApiKey: string = storage.get('account.steamWebApiKey');
  private accountLanguage: string = storage.get('account.language');
  private gameInputs = {} as StoreGameDataType;
  private gameData = {} as SteamRetrieverGameDataType;

  private console(content: AxiosError | Error | string, space = false) {
    let nContent = content;
    if (typeof nContent === 'string') {
      logger.info(`SteamRetriever: ${nContent}`);
    } else if (orgAxios.isAxiosError(nContent)) {
      const url = new URL(nContent.config.url!);
      const urlSearchParameters = url.searchParams;
      const urlQueryPrivacy = '_PRIVACY_';

      if (urlSearchParameters.has('key')) {
        urlSearchParameters.set('key', urlQueryPrivacy);
      }

      if (urlSearchParameters.has('digest')) {
        urlSearchParameters.set('digest', urlQueryPrivacy);
      }

      nContent = `${url.href}; response: ${nContent.message}`;

      logger.error(`SteamRetriever: ${nContent}`);
    } else {
      logger.error(util.format('SteamRetriever:', nContent));
    }

    this.window.webContents.send('console-add', typeof nContent === 'string' ? nContent : nContent.message, space);
  }

  private consoleHide(isOk = false) {
    this.window.webContents.send('console-hide', isOk);
  }

  private consoleShow() {
    this.window.webContents.send('console-show');
  }

  private async getAppType() {
    this.console(`Trying to get type of ${this.gameInputs.appId}...`);

    const url = `https://store.steampowered.com/api/appdetails/?appids=${this.gameInputs.appId}&filters=basic`;
    const response = await axios.get(url, { id: `steam_appdetails_${this.gameInputs.appId}` });
    const responseData = response.data as SteamRetrieverAppDetailsType;

    const data = responseData[this.gameInputs.appId];
    if (data.success === true) {
      if (data.data.type === 'game') {
        this.console('The appid is the "game" type, keep on...', true);

        await ensureDir(this.gameInputs.paths.dataRootPath);
        await ensureDir(this.gameInputs.paths.achievementsRootPath);
      } else {
        throw new Error('The appid is not a game.');
      }
    } else {
      throw new Error('The appid was not found.');
    }
  }

  private signToolVerify(filePath: string) {
    try {
      const spawn = appSpawn(paths.signTool.filePath, ['verify', '/pa', filePath], paths.signTool.rootPath);
      return spawn.status === 0;
    } catch {
      return false;
    }
  }

  private async checkSteamApiDlls() {
    this.console('Check if the steam_api(64).dll are signed...');

    const steamApiDlls = await glob(['**/steam_api.dll', '**/steam_api64.dll'], {
      absolute: true,
      cwd: this.gameInputs.executableWorkingDirectory,
      onlyFiles: true,
    });
    if (steamApiDlls.length > 0) {
      for (const dll of steamApiDlls) {
        const isSigned = this.signToolVerify(dll);

        if (isSigned) {
          this.console(`${dll} is signed, keep on...`, true);
        } else {
          throw new Error(`${dll} is not signed, please use signed steam_api(64).dll only!`);
        }
      }

      const dllStats = await stat(steamApiDlls[0]);
      const dllBirthTime = dllStats.birthtime.getTime();
      const timeStampMay2016 = Date.parse('01/05/2016');

      if (dllBirthTime >= timeStampMay2016) {
        this.console(
          "The creation date of the dll is higher than May 2016, i don't create steam_interfaces.txt.",
          true
        );
      } else {
        this.console('The creation date of the dll is less than May 2016, i create steam_interfaces.txt.', true);
        await this.writeSteamApiInterfaces(steamApiDlls[0]);
      }
    } else {
      this.console(
        'The game does not contain any steam_api64.dll, if it is drm-free everything is in order otherwise select the correct run path!',
        true
      );
    }
  }

  private async getAppInfo() {
    this.console(`Trying to get infos on ${this.gameInputs.appId}...`);

    const url = `https://store.steampowered.com/api/dlcforapp/?appid=${this.gameInputs.appId}`;
    const response = await axios.get(url, { id: `steam_dlcsforapp_${this.gameInputs.appId}` });
    const responseData = response.data as SteamRetrieverDlcForAppType;

    if (responseData.status === 1) {
      this.gameData.name = responseData.name;

      this.console(`NAME: ${this.gameData.name}; DLCS: ${responseData.dlc.length}`, true);

      if (responseData.dlc.length > 0) {
        const dlcsResult = [];
        for (const appDlcData of responseData.dlc) {
          const appDlcAppId = appDlcData.id;
          const appDlcMame = appDlcData.name;
          this.console(`DLC AppID: ${appDlcAppId}; DLC Name: ${appDlcMame}`, true);
          dlcsResult.push(`${appDlcAppId}=${appDlcMame}`);
        }

        await writeFile(this.gameInputs.paths.dlcsFilePath, dlcsResult.join('\r\n')).then(() => {
          this.console(`${this.gameInputs.paths.dlcsFilePath} was written successfully!`, true);
        });
      } else {
        this.console('The game does not contain dlcs.', true);
      }
    } else {
      throw new Error('The appid was not found.');
    }
  }

  private async downloadAppHeader() {
    // const url = `https://cdn.akamai.steamstatic.com/steam/apps/${this.gameInputs.appId}/header.jpg?t=1581535048`;
    const url = `https://cdn.cloudflare.steamstatic.com/steam/apps/${this.gameInputs.appId}/library_600x900.jpg?t=1647432985`;

    // if (!(await pathExists(this.gameInputs.paths.headerFilePath))) {
    await appDownload(url, this.gameInputs.paths.headerFilePath).then(() => {
      this.console(`${url} was downloaded successfully!`);
    });
    /* } else {
      this.console(`${this.gameInputs.paths.headerFilePath} already exists, skip...`);
    }*/
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private async getAppAchievements() {
    this.console(`Trying to get achievements and stats on ${this.gameInputs.appId}...`);

    const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${this.accountSteamWebApiKey}&l=${this.accountLanguage}&appid=${this.gameInputs.appId}`;
    const response = await axios.get(url, { id: `steam_getschemaforgame_${this.gameInputs.appId}` });
    const responseData = response.data as SteamRetrieverGetSchemaForGameType;

    if (
      typeof responseData.game !== 'undefined' &&
      typeof responseData.game.availableGameStats !== 'undefined' &&
      typeof responseData.game.availableGameStats.achievements !== 'undefined' &&
      responseData.game.availableGameStats.achievements.length > 0
    ) {
      const achievementsData = responseData.game.availableGameStats.achievements;
      const achievementsResult = [];
      let achievementIndex = 0;

      for (const achievement of achievementsData) {
        const achievementName = achievement.name;

        const iconUrl = achievement.icon;
        const iconGrayUrl = achievement.icongray;

        const iconName = `ACH_${achievementIndex}.jpg`;
        const iconGrayName = `ACH_${achievementIndex}_locked.jpg`;

        const iconNamePath = join(this.gameInputs.paths.achievementsRootPath, iconName);
        const iconGrayNamePath = join(this.gameInputs.paths.achievementsRootPath, iconGrayName);

        achievement.icon = `achievements/${iconName}`;
        achievement.icongray = `achievements/${iconGrayName}`;

        achievementsResult.push(achievement);

        this.console(`${achievementName} Achievement`);

        if (!(await pathExists(iconNamePath))) {
          await appDownload(iconUrl, iconNamePath).then(() => {
            this.console(`${iconName} was downloaded successfully!`, true);
          });
        } else {
          this.console(`${iconName} already exists, skip...`, true);
        }

        if (!(await pathExists(iconGrayNamePath))) {
          await appDownload(iconGrayUrl, iconGrayNamePath).then(() => {
            this.console(`${iconGrayName} was downloaded successfully!`, true);
          });
        } else {
          this.console(`${iconGrayName} already exists, skip...`, true);
        }

        achievementIndex++;
      }

      await writeJson(this.gameInputs.paths.achievementsFilePath, achievementsResult, {
        spaces: 2,
      }).then(() => {
        this.console(`${this.gameInputs.paths.achievementsFilePath} was written successfully!`, true);
      });
    } else {
      this.console('The game has no achievements.', true);
    }

    if (
      typeof responseData.game !== 'undefined' &&
      typeof responseData.game.availableGameStats !== 'undefined' &&
      typeof responseData.game.availableGameStats.stats !== 'undefined' &&
      responseData.game.availableGameStats.stats.length > 0
    ) {
      const statsData = responseData.game.availableGameStats.stats;
      const statsResult = [];
      for (const _stat of statsData) {
        const { name, defaultvalue } = _stat;
        // NOTE: ..., float, avgrate but where can I find this data?
        const typeValue = 'int';

        statsResult.push(`${name}=${typeValue}=${defaultvalue}`);
      }

      await writeFile(this.gameInputs.paths.statsFilePath, statsResult.join('\r\n')).then(() => {
        this.console(`${this.gameInputs.paths.statsFilePath} was written successfully!`, true);
      });
    } else {
      this.console('The game has no stats.', true);
    }
  }

  private async getAppItems() {
    this.console(`Trying to get items on ${this.gameInputs.appId}...`);

    let url = `https://api.steampowered.com/IInventoryService/GetItemDefMeta/v1/?key=${this.accountSteamWebApiKey}&appid=${this.gameInputs.appId}`;
    let response = await axios.get(url, { id: `steam_getitemdefmeta_${this.gameInputs.appId}` });
    const { digest } = (response.data as SteamRetrieverGetItemDefMetaType).response;

    if (typeof digest !== 'undefined') {
      url = `https://api.steampowered.com/IGameInventory/GetItemDefArchive/v1/?digest=${digest}&appid=${this.gameInputs.appId}`;
      response = await axios.get(url, { id: `steam_getitemdefarchive_${this.gameInputs.appId}` });
      // NOTE: the last character is a finger in the ass
      response.data = JSON.parse((response.data as string).slice(0, -1)) as SteamRetrieverGetItemDefArchiveType;

      const resultItems: Record<string, unknown> = {};
      const resultDefaultItems: Record<string, number> = {};

      for (const item of response.data as SteamRetrieverGetItemDefArchiveType) {
        const { itemdefid } = item;
        resultItems[itemdefid] = item;
        resultDefaultItems[itemdefid] = 1;
      }

      await writeJson(this.gameInputs.paths.itemsFilePath, resultItems, {
        spaces: 2,
      }).then(() => {
        this.console(`${this.gameInputs.paths.itemsFilePath} was written successfully!`, true);
      });

      await writeJson(this.gameInputs.paths.defaultItemsFilePath, resultDefaultItems, {
        spaces: 2,
      }).then(() => {
        this.console(`${this.gameInputs.paths.defaultItemsFilePath} was written successfully!`, true);
      });
    } else {
      this.console('The game has no items.', true);
    }
  }

  private async addGame() {
    const inputs: StoreGameDataType = {
      ...this.gameInputs,
      ...this.gameData,
    };

    if (storage.has(`games.${inputs.appId}`)) {
      const oo = 'Game rebased successfully!';
      appNotify(oo);
      this.console(oo);
    } else {
      const oo = 'Game created successfully!';
      appNotify(oo);
      this.console(oo);

      await SteamCloud.restore(inputs);
    }

    storage.set(`games.${inputs.appId}`, inputs);

    this.consoleHide(true);
  }

  public async run(inputs: StoreGameDataType) {
    this.gameInputs = await SteamGame.generateGameExtraInfo(inputs);

    this.consoleShow();

    let stop = false;

    try {
      await this.getAppType();
      await this.checkSteamApiDlls();
      await this.getAppInfo();
      await this.downloadAppHeader();
    } catch (error: unknown) {
      this.console(error as Error, true);
      this.consoleHide();
      stop = true;
    }

    if (!stop) {
      try {
        if (this.accountSteamWebApiKey.length > 0) {
          await this.getAppAchievements();
        } else {
          this.console('The WebApi key is missing, i skip the achievements and stats.');
        }
      } catch (error: unknown) {
        this.console(error as Error, true);
      }

      try {
        if (this.accountSteamWebApiKey.length > 0) {
          await this.getAppItems();
        } else {
          this.console('The WebApi key is missing, i skip the items.');
        }
      } catch (error: unknown) {
        this.console(error as Error, true);
      }

      try {
        await this.addGame();
      } catch (error: unknown) {
        this.console(error as Error, true);
        this.consoleHide();
      }
    }
  }

  private async writeSteamApiInterfaces(dll: string) {
    await appExec(paths.generateInterfacesFile.filePath, [dll], this.gameInputs.paths.dataRootPath);
    this.console(`${this.gameInputs.paths.steamInterfacesFilePath} was written successfully!`, true);
  }
}

export default SteamRetriever;
