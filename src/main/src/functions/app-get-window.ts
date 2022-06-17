import { BrowserWindow } from 'electron';

// NOTE: not the best approach
const appGetWindow = () => {
  const allWindows = BrowserWindow.getAllWindows();
  return allWindows.length > 0 ? allWindows[0] : undefined;
};

export default appGetWindow;
