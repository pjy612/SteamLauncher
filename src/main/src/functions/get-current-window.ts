import { BrowserWindow, IpcMainInvokeEvent } from 'electron';

const getCurrentWindow = (event: IpcMainInvokeEvent) => BrowserWindow.fromId(event.frameId);

export default getCurrentWindow;
