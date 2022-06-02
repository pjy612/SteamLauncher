import { dialog } from 'electron';

const appPromptYesNo = async (message: string) => {
  const prompt = await dialog.showMessageBox({
    buttons: ['Yes', 'No'],
    cancelId: 1,
    defaultId: 1,
    message,
    type: 'warning',
  });
  return prompt.response === 0;
};

export default appPromptYesNo;
