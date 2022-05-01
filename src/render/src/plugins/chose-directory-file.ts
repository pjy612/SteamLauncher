import type { OpenDialogReturnValue } from 'electron';

const fill = (dom: JQuery, values: OpenDialogReturnValue) => {
  const { filePaths } = values;
  if (typeof filePaths !== 'undefined') {
    const inputGroup = dom.closest('.input-group');
    const input = inputGroup.find('.form-control');
    input.val(filePaths[0]);
  }
};

const choseDirectory = () => window.api.app.choseDirectory();

const choseFile = () => window.api.app.choseFile();

$(() => {
  $(document).on('click', '*[data-sk="choseDirFile"]', async (event) => {
    event.preventDefault();
    const dom = $(event.currentTarget) as JQuery<HTMLElement>;
    const what = dom.attr('data-sk-what');
    let chosed;

    switch (what) {
      case 'dir': {
        chosed = await choseDirectory();
        break;
      }
      case 'file': {
        chosed = await choseFile();
        break;
      }
      default: {
        chosed = await choseDirectory();
        break;
      }
    }

    fill(dom, chosed);
  });
});
