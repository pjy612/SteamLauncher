import { app, Notification } from 'electron';
import paths from '../configs/paths';
import logger from '../instances/logger';

const appNotify = (message: string) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: app.getName(),
      body: message,
      icon: paths.files.iconFilePath,
    });
    notification.show();
  } else {
    logger.info(message);
  }
};

export default appNotify;
