import {
  Notification,
} from 'electron';
import log from 'electron-log';

const notify = (message: string) => {
  if (Notification.isSupported()) {
    const nn = new Notification({
      body: message,
    });
    nn.show();
  } else {
    log.error('Notifications system isn\'t supported! Message:');
    log.info(message);
  }
};

export default notify;
