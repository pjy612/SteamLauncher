import type { AxiosError } from 'axios';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import axios from 'axios';
import glob from 'fast-glob';
import { ensureDir, pathExists, writeFile, writeJson } from 'fs-extra';
import appDownload from '../functions/app-download';
import appNotify from '../functions/app-notify';
import logger from '../instances/logger';
import storage from '../instances/storage';
import { appGetWindow } from '../functions/app-window';
import appSpawn from '../functions/app-spawn';
import paths from '../configs/paths';
import SteamGame from './steam-game';
import SteamCloud from './steam-cloud';

class SteamRetriever {
  private accountSteamWebApiKey: string = storage.get('account.steamWebApiKey');
  private accountLanguage: string = storage.get('account.language');
  private ipcEvent = appGetWindow()!;
  private gameData = {} as SteamRetrieverGameDataType;
  private readonly gameAppId: string;
  private readonly gamePaths;
  private readonly gameInputs;

  public constructor(inputs: StoreGameDataType) {
    this.gameInputs = inputs;
    this.gameAppId = inputs.appId;
    this.gamePaths = SteamGame.getPaths(inputs.appId);
  }

  private console(content: AxiosError | Error | string, space = false) {
    let nContent = content;
    if (typeof nContent === 'string') {
      logger.info(`SteamRetriever: ${nContent}`);
    } else if (axios.isAxiosError(nContent)) {
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
      logger.error(`SteamRetriever: ${nContent.message}`);
    }

    this.ipcEvent.webContents.send('console-add', typeof nContent === 'string' ? nContent : nContent.message, space);
  }

  private consoleHide(isOk = false) {
    this.ipcEvent.webContents.send('console-hide', isOk);
  }

  private consoleShow() {
    this.ipcEvent.webContents.send('console-show');
  }

  private signToolVerify(filePath: string) {
    try {
      const spawn = appSpawn(paths.signTool.filePath, ['verify', '/pa', filePath], paths.signTool.rootPath);
      return spawn.status === 0;
    } catch {
      return false;
    }
  }

  private async getAppType() {
    this.console(`Trying to get type of ${this.gameAppId}...`);

    const url = `https://store.steampowered.com/api/appdetails/?appids=${this.gameAppId}&filters=basic`;
    const response = await axios.get(url);
    const responseData = response.data as SteamRetrieverAppDetailsType;

    const data = responseData[this.gameAppId];
    if (data.success === true) {
      if (data.data.type === 'game') {
        this.console('The appid is the "game" type, keep on...', true);

        await ensureDir(this.gamePaths.dataRootPath);
        await ensureDir(this.gamePaths.achievementsRootPath);
      } else {
        throw new Error('The appid is not a game.');
      }
    } else {
      throw new Error('The appid was not found.');
    }
  }

  private async checkSteamApiDlls() {
    this.console('Check if the steam_api(64).dll are signed...');

    const searchDlls = await glob(['**/steam_api.dll', '**/steam_api64.dll'], {
      absolute: true,
      cwd: this.gameInputs.executableWorkingDirectory,
      onlyFiles: true,
    });
    if (searchDlls.length > 0) {
      for (const dll of searchDlls) {
        const isSigned = this.signToolVerify(dll);

        if (isSigned) {
          this.console(`${dll} is signed, keep on...`, true);
        } else {
          throw new Error(`${dll} is not signed, please use signed steam_api(64).dll only!`);
        }
      }

      const dllStats = await stat(searchDlls[0]);
      const dllBirthtime = dllStats.birthtime.getTime();
      const msMay2016 = Date.parse('01/05/2016');

      if (dllBirthtime >= msMay2016) {
        this.console(
          "The creation date of the dll is higher than May 2016, i don't create steam_interfaces.txt.",
          true
        );
      } else {
        this.console('The creation date of the dll is less than May 2016, i create steam_interfaces.txt.', true);
        await this.writeSteamApiInterfaces(searchDlls[0]);
      }
    } else {
      this.console(
        'The game does not contain any steam_api64.dll, if it is drm-free everything is in order otherwise select the correct run path!',
        true
      );
    }
  }

  private async getAppInfo() {
    this.console(`Trying to get infos on ${this.gameAppId}...`);

    const url = `https://store.steampowered.com/api/dlcforapp/?appid=${this.gameAppId}`;
    const response = await axios.get(url);
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

        await writeFile(this.gamePaths.dlcsFilePath, dlcsResult.join('\r\n')).then(() => {
          this.console(`${this.gamePaths.dlcsFilePath} was written successfully!`, true);
        });
      } else {
        this.console('The game does not contain dlcs.', true);
      }
    } else {
      throw new Error('The appid was not found.');
    }
  }

  private async downloadAppHeader() {
    const url = `https://cdn.akamai.steamstatic.com/steam/apps/${this.gameAppId}/header.jpg?t=1581535048`;

    if (!(await pathExists(this.gamePaths.headerFilePath))) {
      await appDownload(url, this.gamePaths.headerFilePath).then(() => {
        this.console(`${url} was downloaded successfully!`);
      });
    } else {
      this.console(`${this.gamePaths.headerFilePath} already exists, skip...`);
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private async getAppAchievements() {
    this.console(`Trying to get achievements and stats on ${this.gameAppId}...`);

    const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${this.accountSteamWebApiKey}&l=${this.accountLanguage}&appid=${this.gameAppId}`;
    const response = await axios.get(url);
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

        const iconNamePath = join(this.gamePaths.achievementsRootPath, iconName);
        const iconGrayNamePath = join(this.gamePaths.achievementsRootPath, iconGrayName);

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

      await writeJson(this.gamePaths.achievementsFilePath, achievementsResult, {
        spaces: 2,
      }).then(() => {
        this.console(`${this.gamePaths.achievementsFilePath} was written successfully!`, true);
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

      await writeFile(this.gamePaths.statsFilePath, statsResult.join('\r\n')).then(() => {
        this.console(`${this.gamePaths.statsFilePath} was written successfully!`, true);
      });
    } else {
      this.console('The game has no stats.', true);
    }
  }

  private async getAppItems() {
    this.console(`Trying to get items on ${this.gameAppId}...`);

    let url = `https://api.steampowered.com/IInventoryService/GetItemDefMeta/v1/?key=${this.accountSteamWebApiKey}&appid=${this.gameAppId}`;
    let response = await axios.get(url);
    const { digest } = (response.data as SteamRetrieverGetItemDefMetaType).response;

    if (typeof digest !== 'undefined') {
      url = `https://api.steampowered.com/IGameInventory/GetItemDefArchive/v1/?digest=${digest}&appid=${this.gameAppId}`;
      response = await axios.get(url);
      // NOTE: the last character is a finger in the ass
      response.data = JSON.parse((response.data as string).slice(0, -1)) as SteamRetrieverGetItemDefArchiveType;

      const resultItems: Record<string, unknown> = {};
      const resultDefaultItems: Record<string, number> = {};

      for (const item of response.data as SteamRetrieverGetItemDefArchiveType) {
        const { itemdefid } = item;
        resultItems[itemdefid] = item;
        resultDefaultItems[itemdefid] = 1;
      }

      await writeJson(this.gamePaths.itemsFilePath, resultItems, {
        spaces: 2,
      }).then(() => {
        this.console(`${this.gamePaths.itemsFilePath} was written successfully!`, true);
      });

      await writeJson(this.gamePaths.defaultItemsFilePath, resultDefaultItems, {
        spaces: 2,
      }).then(() => {
        this.console(`${this.gamePaths.defaultItemsFilePath} was written successfully!`, true);
      });
    } else {
      this.console('The game has no items.', true);
    }
  }

  private addGame() {
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

      SteamCloud.restore(inputs);
    }

    storage.set(`games.${inputs.appId}`, inputs);

    this.consoleHide(true);
  }

  public async run() {
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
        this.addGame();
      } catch (error: unknown) {
        this.console(error as Error, true);
        this.consoleHide();
      }
    }
  }

  // BASED ON generate_interfaces_file.cpp BY Mr. GoldBerg
  private async writeSteamApiInterfaces(dll: string) {
    const interfaces = await this.findSteamApiInterfaces(dll);
    await writeFile(this.gamePaths.steamInterfacesFilePath, interfaces.join('\r\n')).then(() => {
      this.console(`${this.gamePaths.steamInterfacesFilePath} was written successfully!`, true);
    });
  }

  private findSteamApiInterface(content: string, regexp: string) {
    const result: string[] = [];
    const re = new RegExp(regexp, 'gmu');
    const matches = content.match(re);

    if (matches !== null) {
      for (const match of matches) {
        result.push(match);
      }
    }

    return result;
  }

  private async findSteamApiInterfaces(dll: string) {
    const interfaces = [
      'SteamClient',
      'SteamGameServer',
      'SteamGameServerStats',
      'SteamUser',
      'SteamFriends',
      'SteamUtils',
      'SteamMatchMaking',
      'SteamMatchMakingServers',
      'STEAMUSERSTATS_INTERFACE_VERSION',
      'STEAMAPPS_INTERFACE_VERSION',
      'SteamNetworking',
      'STEAMREMOTESTORAGE_INTERFACE_VERSION',
      'STEAMSCREENSHOTS_INTERFACE_VERSION',
      'STEAMHTTP_INTERFACE_VERSION',
      'STEAMUNIFIEDMESSAGES_INTERFACE_VERSION',
      'STEAMUGC_INTERFACE_VERSION',
      'STEAMAPPLIST_INTERFACE_VERSION',
      'STEAMMUSIC_INTERFACE_VERSION',
      'STEAMMUSICREMOTE_INTERFACE_VERSION',
      'STEAMHTMLSURFACE_INTERFACE_VERSION_',
      'STEAMINVENTORY_INTERFACE_V',
      'SteamController',
      'SteamMasterServerUpdater',
      'STEAMVIDEO_INTERFACE_V',
    ];
    const content = await readFile(dll, {
      encoding: 'utf8',
    });
    let result: string[] = [];

    for (const _interface of interfaces) {
      const matches = this.findSteamApiInterface(content, `${_interface}\\d{3}`);
      result = [...result, ...matches];
    }

    if (this.findSteamApiInterface(content, 'STEAMCONTROLLER_INTERFACE_VERSION\\d{3}').length === 0) {
      const matches = this.findSteamApiInterface(content, 'STEAMCONTROLLER_INTERFACE_VERSION');
      result = [...result, ...matches];
    }

    return result;
  }
}

export default SteamRetriever;
