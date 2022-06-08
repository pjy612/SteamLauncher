import { appGetWindow } from './app-window';

const appModalsHide = () => {
  const window = appGetWindow();
  if (typeof window !== 'undefined') {
    window.webContents.send('app-modals-hide');
  }
};

export default appModalsHide;
