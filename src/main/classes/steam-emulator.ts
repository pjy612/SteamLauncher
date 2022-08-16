/* eslint-disable sonarjs/no-duplicate-string */
import { join } from 'node:path';
import AdmZip from 'adm-zip';
import { ensureDir, pathExists } from 'fs-extra';
import axios from '../instances/axios-cache';
import appDownload from '../functions/app-download';
import appNotify from '../functions/app-notify';
import logger from '../instances/logger';
import storage from '../instances/storage';
import paths from '../configs/paths';
import storageDefaults from '../configs/storage-defaults';

class SteamEmulator {
  private readonly loggerHeader = 'SteamEmulator:';

  private readonly emulatorUpdater = storage.get('settings.emulatorUpdater', storageDefaults.settings.emulatorUpdater);

  private static async checkEmulatorFilesExists() {
    return (
      (await pathExists(paths.emulator.steamClientFilePath)) && (await pathExists(paths.emulator.steamClient64FilePath))
    );
  }

  private async getLatestVersion() {
    try {
      const emulatorLocalJobId: string | undefined = storage.get('settings.emulatorLocalJobId');

      const response = await axios.get('https://mr_goldberg.gitlab.io/goldberg_emulator/', {
        id: 'mr_goldberg_emulator_gitlab_io',
      });
      const responseHtml = response.data as string;

      const regex = /https:\/\/gitlab\.com\/Mr_Goldberg\/goldberg_emulator\/-\/jobs\/(\d+)\/artifacts\/download/gu;
      const match = [...responseHtml.matchAll(regex)][0];
      const downloadUrl = match[0];
      const downloadJobId = match[1];

      if (typeof downloadUrl === 'undefined' && typeof downloadJobId === 'undefined') {
        logger.error(`${this.loggerHeader} Unknown error, the emulator info could not be extracted.`);
        return false;
      }

      logger.debug(
        `${this.loggerHeader} Extracted info: emulatorLocalJobId -> "${
          emulatorLocalJobId as string
        }"; emulatorOnlineJobId -> "${downloadJobId}"; emulatorUrlDownload -> "${downloadUrl}"...`
      );

      if (emulatorLocalJobId === downloadJobId && (await SteamEmulator.checkEmulatorFilesExists())) {
        logger.info(`${this.loggerHeader} Good job! You already have the latest version of the emulator.`);
        return true;
      }

      await ensureDir(paths.emulator.steamJobsRootPath);

      const emulatorJobZipFilePath = join(paths.emulator.steamJobsRootPath, `${downloadJobId}.zip`);
      if (!(await pathExists(emulatorJobZipFilePath))) {
        logger.info(`${this.loggerHeader} I'm downloading the latest version of the emulator...`);
        await appDownload(downloadUrl, emulatorJobZipFilePath);
      } else {
        logger.info(`${this.loggerHeader} I take the latest version of the emulator from the cache...`);
      }

      const emulatorJobZipFile = new AdmZip(emulatorJobZipFilePath);
      emulatorJobZipFile.extractEntryTo(
        'experimental_steamclient/steamclient.dll',
        paths.emulator.rootPath,
        false,
        true
      );
      emulatorJobZipFile.extractEntryTo(
        'experimental_steamclient/steamclient64.dll',
        paths.emulator.rootPath,
        false,
        true
      );

      logger.info(`${this.loggerHeader} The emulator has been successfully saved to disk.`);
      storage.set('settings.emulatorLocalJobId', downloadJobId);
      return true;
    } catch (error) {
      logger.error(`${this.loggerHeader} ${(error as Error).message}`);
      return false;
    }
  }

  public async checkForUpdatesAndNotify() {
    if (await SteamEmulator.checkEmulatorFilesExists()) {
      logger.info(`${this.loggerHeader} The emulator files exist, check if automatic updates are enabled...`);
      if (this.emulatorUpdater) {
        logger.info(`${this.loggerHeader} Automatic updates are enabled...`);
        await this.getLatestVersion();
      } else {
        logger.info(`${this.loggerHeader} Automatic updates are disabled...`);
      }
    } else {
      logger.info(`${this.loggerHeader} The emulator files do not exist, I download the latest version...`);
      // NOTE: if it does not exist, it is also correct to remove the trace of the last used version
      storage.set('settings.emulatorLocalJobId', '');
      await this.getLatestVersion();
    }

    const checkAfterExtractionOfFiles = await SteamEmulator.checkEmulatorFilesExists();
    if (!checkAfterExtractionOfFiles) {
      appNotify(`${this.loggerHeader} Unknown error, check the logs!`);
    }

    return checkAfterExtractionOfFiles;
  }
}

export default SteamEmulator;
