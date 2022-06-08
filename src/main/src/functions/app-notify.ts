import { Notification } from 'electron';
import logger from '../instances/logger';

const appNotify = (message: string) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      body: message,
    });
    notification.show();
  } else {
    logger.info(message);
  }
};

export default appNotify;
