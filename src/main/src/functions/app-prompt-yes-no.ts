import { dialog } from 'electron';
import appGetWindow from './app-get-window';

const appPromptYesNo = async (
  message: string,
  type: 'none' | 'info' | 'error' | 'question' | 'warning' = 'question'
) => {
  const window = appGetWindow();
  const prompt = await dialog.showMessageBox(window!, {
    buttons: ['Yes', 'No'],
    cancelId: 1,
    defaultId: 1,
    message,
    type,
  });
  return prompt.response === 0;
};

export default appPromptYesNo;
