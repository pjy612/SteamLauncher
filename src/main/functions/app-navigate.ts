import appGetWindow from './app-get-window';

const appNavigate = (to: string) => {
  const window = appGetWindow();
  if (typeof window !== 'undefined') {
    window.webContents.send('app-navigate', to);
  }
};

export default appNavigate;
