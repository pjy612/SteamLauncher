import { dialog } from 'electron';
import appGetWindow from './app-get-window';

const appPromptYesNo = async (
  message: string,
  type: 'none' | 'info' | 'error' | 'question' | 'warning' = 'question'
) => {
  const appWindow = appGetWindow();
  if (typeof appWindow !== 'undefined') {
    const prompt = await dialog.showMessageBox(appWindow, {
      buttons: ['Yes', 'No'],
      cancelId: 1,
      defaultId: 1,
      message,
      type,
    });
    return prompt.response === 0;
  }
  return false;
};

export default appPromptYesNo;
