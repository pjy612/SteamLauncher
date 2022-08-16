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

    const { canceled, filePaths } = chosed;
    if (!canceled) {
      const path = filePaths[0];
      dom.closest('.input-group').find('.form-control').val(path);
    }
  });
});

export {};
