import { BrowserWindow, IpcMainInvokeEvent } from 'electron';

const getCurrentWindow = (event: IpcMainInvokeEvent) => {
  return BrowserWindow.fromId(event.frameId);
};

export default getCurrentWindow;
