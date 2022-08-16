$(() => {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  $.fn.fileDrop = function fileDrop(callback) {
    const activeClass = 'drop-highlight';
    const allowedExtensions = new Set(['.exe']);

    return this.each(() => {
      const dom = $(this);

      dom.on('click', async (event) => {
        event.preventDefault();
        const { canceled, filePaths } = await window.api.app.choseFile();
        if (!canceled) {
          const selectedFilePath = filePaths[0];
          const parsedFilePath = await window.api.app.filePathParse(selectedFilePath);
          if (allowedExtensions.has(parsedFilePath.ext)) {
            callback.call(this, parsedFilePath);
          } else {
            window.api.app.notify('The file extension is not allowed!');
          }
        }
      });

      dom.on('dragenter dragend dragleave dragover dragstart drag', (event) => {
        event.preventDefault();
      });

      dom.on('dragover', () => {
        dom.addClass(activeClass);
      });

      dom.on('dragleave', () => {
        dom.removeClass(activeClass);
      });

      dom.on('drop', async (event) => {
        dom.trigger('dragleave');

        const dataTransfer = event.originalEvent?.dataTransfer;
        if (typeof dataTransfer !== 'undefined' && dataTransfer !== null) {
          const { files: droppedFiles, items } = dataTransfer;
          if (droppedFiles.length === 1) {
            const { 0: firstItem } = items;
            const { kind } = firstItem;
            if (kind === 'file') {
              const droppedFilePath = droppedFiles[0].path;
              const parsedFilePath = await window.api.app.filePathParse(droppedFilePath);
              if (allowedExtensions.has(parsedFilePath.ext)) {
                callback.call(this, parsedFilePath);
              } else {
                window.api.app.notify('The file extension is not allowed!');
              }
            } else {
              window.api.app.notify('The dropped item is not a valid file!');
            }
          } else {
            window.api.app.notify('Is not possible to add more than one file!');
          }
        } else {
          window.api.app.notify('Unknown Error');
        }
      });
    });
  };
});

export {};
