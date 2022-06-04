import { join } from 'node:path';
import AdmZip from 'adm-zip';
import axios from 'axios';
import { ensureDir, pathExists } from 'fs-extra';
import appDownload from '../functions/app-download';
import log from '../instances/log';
import storage from '../instances/storage';
import paths from '../configs/paths';

class SteamEmulator {
  public static async checkForUpdatesAndNotify() {
    const existsEmuFiles =
      (await pathExists(paths.emulator.steamClientFilePath)) &&
      (await pathExists(paths.emulator.steamClient64FilePath));

    try {
      log.info('MrGoldBergEmulator: Check which is the latest version of the emulator...');

      const url = 'https://mr_goldberg.gitlab.io/goldberg_emulator/';
      const response = await axios.get(url);
      const responseHtml = response.data as string;
      const regex =
        /https:\/\/gitlab\.com\/Mr_Goldberg\/goldberg_emulator\/-\/jobs\/(?<jobid>.*)\/artifacts\/download/gu;
      const match = [...responseHtml.matchAll(regex)].map((match) => [match[0], match.groups?.jobid]);
      const downloadUrl = match[0][0];
      const downloadJobId = match[0][1];

      if (typeof downloadUrl === 'undefined' && typeof downloadJobId === 'undefined') {
        log.error(
          'MrGoldBergEmulator: Unknown error, it was not possible to check which is the latest version of the emulator.'
        );
        // NOTE: i still continue if the emulator exists.
        return existsEmuFiles;
      }

      const emulatorLocalJobId: string = storage.get('settings.emulatorLocalJobId');
      if (emulatorLocalJobId === downloadJobId && existsEmuFiles) {
        log.info(
          `MrGoldBergEmulator: Good job! You already have the latest version of the emulator. (emulatorLocalJobId: ${emulatorLocalJobId}, emulatorOnlineJobId: ${downloadJobId})`
        );
        return true;
      }

      const pathZip = join(paths.emulator.jobsPath, `${downloadJobId!}.zip`);

      await ensureDir(paths.emulator.jobsPath);

      if (!(await pathExists(pathZip))) {
        log.info(
          `MrGoldBergEmulator: I'm downloading the latest version of the emulator... (emulatorOnlineJobId: ${
            downloadJobId as string
          })`
        );
        await appDownload(downloadUrl!, pathZip);
      } else {
        log.info(
          `MrGoldBergEmulator: I take the latest version of the emulator from the cache... (emulatorOnlineJobId: ${
            downloadJobId as string
          })`
        );
      }

      const zip = new AdmZip(pathZip);
      zip.extractEntryTo('experimental_steamclient/steamclient.dll', paths.emulator.rootPath, false, true);
      zip.extractEntryTo('experimental_steamclient/steamclient64.dll', paths.emulator.rootPath, false, true);

      log.info(`MrGoldBergEmulator: The emulator has been successfully updated.`);

      storage.set('settings.emulatorLocalJobId', downloadJobId);

      return true;
    } catch (error) {
      log.error(`MrGoldBergEmulator: ${(error as Error).message}`);
      // NOTE: i still continue if the emulator exists.
      return existsEmuFiles;
    }
  }
}

export default SteamEmulator;
