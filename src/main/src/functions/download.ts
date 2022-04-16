import { createWriteStream } from 'node:fs';
import type { Stream } from 'node:stream';
import axios from 'axios';

const download = async (url: string, saveTo: string) => {
  const response = await axios({
    method: 'GET',
    responseType: 'stream',
    url,
  });
  return new Promise((resolve, reject) => {
    (response.data as Stream)
      .pipe(createWriteStream(saveTo))
      .on('error', reject)
      .once('close', () => {
        resolve(saveTo);
      });
  });
};

export default download;
