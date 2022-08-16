import { shell } from 'electron';
import allowedExternalUrls from '../configs/allowed-external-urls';

const appOpenUrl = (url: string) => {
  const parsedUrl = new URL(url);
  if (allowedExternalUrls.has(parsedUrl.hostname)) {
    setImmediate(async () => {
      await shell.openExternal(url);
    });
  }
};

export default appOpenUrl;
