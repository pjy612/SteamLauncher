import { getWindow } from './app-window';

const appModalsHide = () => {
  const window = getWindow();
  if (typeof window !== 'undefined') {
    window.webContents.send('app-modals-hide');
  }
};

export default appModalsHide;
