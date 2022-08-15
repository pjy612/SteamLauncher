import { writeFile } from 'node:fs/promises';
import axios from 'axios';

const appDownload = async (url: string, saveTo: string) => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  const data = response.data as Buffer;
  return writeFile(saveTo, data);
};

export default appDownload;
