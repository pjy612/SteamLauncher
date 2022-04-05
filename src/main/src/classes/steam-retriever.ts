import {
  createWriteStream,
} from 'node:fs';
import {
  stat,
  readFile,
} from 'node:fs/promises';
import {
  join,
} from 'node:path';
import type {
  AxiosError,
} from 'axios';
import axios from 'axios';
import {
  webContents,
} from 'electron';
import log from 'electron-log';
import glob from 'fast-glob';
import {
  ensureDir,
  pathExists,
  writeFile,
  writeJson,
} from 'fs-extra';
import signVerify from '../bin/sign-verify';
import gamePathsByAppId from '../functions/game-paths-by-appid';
import notify from '../functions/notify';
import storage from '../storage';

class SteamRetriever {
  private accountSteamWebApiKey: string = storage.get('account.steamWebApiKey');

  private accountLanguage: string = storage.get('account.language');

  private ipcEvent = webContents.getFocusedWebContents();

  private gameData: Record<string, string> = {};

  private readonly gameAppId: string;

  private readonly gamePaths;

  private readonly gameInputs;

  public constructor (inputs: StoreGameDataType) {
    this.gameInputs = inputs;
    this.gameAppId = inputs.appId;
    this.gamePaths = gamePathsByAppId(inputs.appId);
  }

  private console (content: AxiosError | Error | string, space = false) {
    let nContent = content;
    if (typeof nContent === 'string') {
      log.info(nContent);
    } else {
      if (axios.isAxiosError(nContent)) {
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
      }

      log.error(nContent);
    }

    this.ipcEvent.send('console-add', typeof nContent === 'string' ? nContent : nContent.message, space);
  }

  private consoleHide (isOk = false) {
    this.ipcEvent.send('console-hide', isOk);
  }

  private consoleShow () {
    this.ipcEvent.send('console-show');
  }

  private async getAppType () {
    this.console(`Trying to get type of ${this.gameAppId}...`);

    const url = `https://store.steampowered.com/api/appdetails/?appids=${this.gameAppId}&filters=basic`;
    const response = await axios.get(url);
    const data = response.data[this.gameAppId];
    if (data.success === true) {
      if (data.data.type === 'game') {
        this.console('The appid is the "game" type, keep on...', true);

        // await ensureDir(this.paths.appIdDataPath);
        await ensureDir(this.gamePaths.appIdAchievementsPath);
      } else {
        throw new Error('The appid is not a game.');
      }
    } else {
      throw new Error('The appid was not found.');
    }
  }

  private async checkSteamApiDlls () {
    this.console('Check if the steam_api(64).dll are signed...');

    const searchDlls = await glob([
      '**/steam_api.dll',
      '**/steam_api64.dll',
    ], {
      absolute: true,
      cwd: this.gameInputs.runPath,
      onlyFiles: true,
    });
    if (searchDlls.length > 0) {
      for (const dll of searchDlls) {
        const isSigned = await signVerify(dll);

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
        this.console('The creation date of the dll is higher than May 2016, i don\'t create steam_interfaces.txt.', true);
      } else {
        this.console('The creation date of the dll is less than May 2016, i create steam_interfaces.txt.', true);
        await this.writeSteamApiInterfaces(searchDlls[0]);
      }
    } else {
      throw new Error('The game does not contain any steam_api(64).dll, please select the correct run path!');
    }
  }

  private async getAppInfo () {
    this.console(`Trying to get infos on ${this.gameAppId}...`);

    const url = `https://store.steampowered.com/api/dlcforapp/?appid=${this.gameAppId}`;
    const response = await axios.get(url);
    if (response.data.status === 1) {
      this.gameData.name = response.data.name;

      this.console(`NAME: ${this.gameData.name}; DLCS: ${response.data.dlc.length}`, true);

      if (response.data.dlc.length > 0) {
        const resultDlcs = [];
        for (const appDlcData of response.data.dlc) {
          const appDlcAppId = appDlcData.id;
          const appDlcMame = appDlcData.name;
          this.console(`DLC AppID: ${appDlcAppId}; DLC Name: ${appDlcMame}`, true);
          resultDlcs.push(`${appDlcAppId}=${appDlcMame}`);
        }

        await writeFile(this.gamePaths.appIdDlcsInfoPath, resultDlcs.join('\r\n')).then(() => {
          this.console(
            `${this.gamePaths.appIdDlcsInfoPath} was written successfully!`,
            true,
          );
        });
      } else {
        this.console('The game does not contain dlcs.', true);
      }
    } else {
      throw new Error('The appid was not found.');
    }
  }

  private async downloadAppHeader () {
    const url = `https://cdn.akamai.steamstatic.com/steam/apps/${this.gameAppId}/header.jpg?t=1581535048`;
    // eslint-disable-next-line no-negated-condition
    if (!(await pathExists(this.gamePaths.appIdHeaderPath))) {
      await this.imageDownloader(url, this.gamePaths.appIdHeaderPath).then(() => {
        this.console(`${url} was downloaded successfully!`);
      });
    } else {
      this.console(`${this.gamePaths.appIdHeaderPath} already exists, skip...`);
    }
  }

  private async getAppAchievements () {
    this.console(`Trying to get achievements and stats on ${this.gameAppId}...`);

    const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${this.accountSteamWebApiKey}&l=${this.accountLanguage}&appid=${this.gameAppId}`;
    const response = await axios.get(url);
    const achievementsData = response.data.game.availableGameStats.achievements;
    if (typeof achievementsData !== 'undefined' && achievementsData.length > 0) {
      const resultAchievements = [];
      for (const achievement of achievementsData) {
        const iconUrl = achievement.icon;
        const iconGrayUrl = achievement.icongray;

        const iconName = `${achievement.name}.jpg`;
        const iconGrayName = `${achievement.name}_locked.jpg`;

        const iconNamePath = join(this.gamePaths.appIdAchievementsPath, iconName);
        const iconGrayNamePath = join(this.gamePaths.appIdAchievementsPath, iconGrayName);

        achievement.icon = `achievements/${iconName}`;
        achievement.icongray = `achievements/${iconGrayName}`;

        resultAchievements.push(achievement);

        // eslint-disable-next-line no-negated-condition
        if (!(await pathExists(iconNamePath))) {
          await this.imageDownloader(iconUrl, iconNamePath).then(() => {
            this.console(`${iconName} was downloaded successfully!`, true);
          });
        } else {
          this.console(`${iconName} already exists, skip...`, true);
        }

        // eslint-disable-next-line no-negated-condition
        if (!(await pathExists(iconGrayNamePath))) {
          await this.imageDownloader(iconGrayUrl, iconGrayNamePath).then(() => {
            this.console(`${iconGrayName} was downloaded successfully!`, true);
          });
        } else {
          this.console(`${iconGrayName} already exists, skip...`, true);
        }
      }

      await writeJson(this.gamePaths.appIdAchievementsInfoPath, resultAchievements, {
        spaces: 2,
      }).then(() => {
        this.console(
          `${this.gamePaths.appIdAchievementsInfoPath} was written successfully!`,
          true,
        );
      });
    } else {
      this.console('The game has no achievements.', true);
    }

    const statsData = response.data.game.availableGameStats.stats;
    if (typeof statsData !== 'undefined' && statsData.length > 0) {
      const resultStats = [];
      // eslint-disable-next-line @typescript-eslint/naming-convention, canonical/id-match
      for (const _stat of statsData) {
        // eslint-disable-next-line @typescript-eslint/naming-convention, canonical/id-match
        const name = _stat.name;
        // NOTE: ..., float, avgrate but where can I find this data?
        const typeValue = 'int';
        // eslint-disable-next-line @typescript-eslint/naming-convention, canonical/id-match
        const defaultValue = _stat.defaultvalue;

        resultStats.push(`${name}=${typeValue}=${defaultValue}`);
      }

      await writeFile(this.gamePaths.appIdStatsInfoPath, resultStats.join('\r\n')).then(() => {
        this.console(`${this.gamePaths.appIdStatsInfoPath} was written successfully!`, true);
      });
    } else {
      this.console('The game has no stats.', true);
    }
  }

  private async getAppItems () {
    this.console(`Trying to get items on ${this.gameAppId}...`);

    let url = `https://api.steampowered.com/IInventoryService/GetItemDefMeta/v1/?key=${this.accountSteamWebApiKey}&appid=${this.gameAppId}`;
    let response = await axios.get(url);
    const digest = response.data.response.digest;
    // eslint-disable-next-line no-negated-condition
    if (typeof digest !== 'undefined') {
      url = `https://api.steampowered.com/IGameInventory/GetItemDefArchive/v1/?digest=${digest}&appid=${this.gameAppId}`;
      response = await axios.get(url);
      // NOTE: the last character is a finger in the ass
      response.data = JSON.parse(response.data.slice(0, -1));

      const resultItems: Record<string, string> = {};
      const resultDefaultItems: Record<string, number> = {};

      for (const item of response.data) {
        const itemdefid = item.itemdefid;
        resultItems[itemdefid] = item;
        resultDefaultItems[itemdefid] = 1;
      }

      await writeJson(this.gamePaths.appIdItemsInfoPath, resultItems, {
        spaces: 2,
      }).then(() => {
        this.console(`${this.gamePaths.appIdItemsInfoPath} was written successfully!`, true);
      });

      await writeJson(this.gamePaths.appIdDefaultItemsInfoPath, resultDefaultItems, {
        spaces: 2,
      }).then(() => {
        this.console(`${this.gamePaths.appIdDefaultItemsInfoPath} was written successfully!`, true);
      });
    } else {
      this.console('The game has no items.', true);
    }
  }

  private async addGame () {
    const inputs: StoreGameDataType = {
      ...this.gameInputs,
      ...this.gameData,
    };

    storage.set(`games.${inputs.appId}`, inputs);

    this.ipcEvent.send('index-reload-games-list');

    if (storage.has(`games.${inputs.appId}`)) {
      const oo = 'Game rebased successfully!';
      notify(oo);
      this.console(oo);
    } else {
      const oo = 'Game created successfully!';
      notify(oo);
      this.console(oo);
    }

    this.consoleHide(true);
  }

  public async run () {
    this.consoleShow();

    let stop = false;

    try {
      await this.getAppType();
      await this.checkSteamApiDlls();
      await this.getAppInfo();
      await this.downloadAppHeader();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.console(error, true);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        this.console(error, true);
      }

      try {
        if (this.accountSteamWebApiKey.length > 0) {
          await this.getAppItems();
        } else {
          this.console('The WebApi key is missing, i skip the items.');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        this.console(error, true);
      }

      try {
        await this.addGame();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        this.console(error, true);
        this.consoleHide();
      }
    }
  }

  private async imageDownloader (url: string, saveTo: string) {
    const response = await axios({
      method: 'GET',
      responseType: 'stream',
      url,
    });
    return await new Promise((resolve, reject) => {
      response.data.pipe(createWriteStream(saveTo))
        .on('error', reject)
        .once('close', () => {
          resolve(saveTo);
        });
    });
  }

  // BASED ON generate_interfaces_file.cpp BY Mr. GoldBerg
  private async writeSteamApiInterfaces (dll: string) {
    const interfaces = await this.findSteamApiInterfaces(dll);
    await writeFile(this.gamePaths.appIdSteamInterfacesPath, interfaces.join('\r\n')).then(() => {
      this.console(
        `${this.gamePaths.appIdSteamInterfacesPath} was written successfully!`,
        true,
      );
    });
  }

  private async findSteamApiInterface (content: string, regexp: string) {
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

  private async findSteamApiInterfaces (dll: string) {
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

    // eslint-disable-next-line @typescript-eslint/naming-convention, canonical/id-match
    for (const _interface of interfaces) {
      const matches = await this.findSteamApiInterface(content, `${_interface}\\d{3}`);
      result = result.concat(matches);
    }

    if ((await this.findSteamApiInterface(content, 'STEAMCONTROLLER_INTERFACE_VERSION\\d{3}')).length === 0) {
      const matches = await this.findSteamApiInterface(content, 'STEAMCONTROLLER_INTERFACE_VERSION');
      result = result.concat(matches);
    }

    return result;
  }
}

export default SteamRetriever;
