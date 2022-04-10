(() => {
  const modalConsole = $('#console');
  const modalTextarea = modalConsole.find('textarea');

  const addToConsole = (txt: string, space = false) => {
    const newTxt = `> - ${space ? '   ' : ''}${txt}`;
    const oldValue = modalTextarea.val() as string;
    const scrollHeight = modalTextarea.prop('scrollHeight') as number;
    const height = modalTextarea.height()!;

    modalTextarea.val(`${oldValue}${newTxt}\r\n`);
    modalTextarea.scrollTop(scrollHeight - height);
  };

  window.api.on('console-show', () => {
    modalConsole.modal('show');
  });

  window.api.on('console-hide', (_event, isOk: boolean) => {
    modalConsole.addClass(isOk ? 'all' : 'only-console');
    addToConsole('');
    addToConsole('');
    addToConsole('PRESS ENTER TO EXIT...');
  });

  window.api.on('console-add', (_event, txt: string, space = false) => {
    addToConsole(txt, space as boolean);
  });

  $(window).on('keyup', (event) => {
    if (event.key === 'Enter') {
      if (modalConsole.hasClass('all')) {
        modalConsole.removeClass('all');
        modalTextarea.val('');
        $('.modal').modal('hide');
      } else {
        modalConsole.removeClass('only-console');
        modalTextarea.val('');
        modalConsole.modal('hide');
      }
    }
  });
})();

export {};
