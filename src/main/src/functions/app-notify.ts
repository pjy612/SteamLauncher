import { Notification } from 'electron';
import log from '../instances/log';

const appNotify = (message: string) => {
  if (Notification.isSupported()) {
    const nn = new Notification({
      body: message,
    });
    nn.show();
  } else {
    // log.error('Notifications system is not supported! Message:');
    log.info(message);
  }
};

export default appNotify;
