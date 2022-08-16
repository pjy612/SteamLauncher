import { app, dialog } from 'electron';

const appShowErrorBox = (content: string) => {
  dialog.showErrorBox(app.getName(), content);
  app.quit();
};

export default appShowErrorBox;
