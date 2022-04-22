import { shell } from 'electron';

import { allowedExternalUrls } from '../config';
import log from '../instances/log';

const openUrlExternally = (url: string) => {
  const parsedUrl = new URL(url);
  if (allowedExternalUrls.has(parsedUrl.origin)) {
    log.debug(`${url} is opened externally.`);
    setImmediate(async () => {
      await shell.openExternal(url);
    });
  }
};

export default openUrlExternally;
