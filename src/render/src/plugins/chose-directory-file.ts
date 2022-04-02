import type {
  OpenDialogReturnValue,
} from 'electron';

(($) => {
  const fill = (dom: JQuery, values: OpenDialogReturnValue) => {
    if (typeof values.filePaths !== 'undefined') {
      const filePaths = values.filePaths;
      const inputGroup = dom.closest('.input-group');
      const input = inputGroup.find('.form-control');
      input.val(filePaths[0]);
    }
  };

  const choseDirectory = async () => {
    return await window.api.app.choseDirectory();
  };

  const choseFile = async () => {
    return await window.api.app.choseFile();
  };

  $(document).on('click', '*[data-sk="choseDirFile"]', async (event) => {
    event.preventDefault();
    const dom = $(event.currentTarget);
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
})(jQuery);

export {};
