$(document).on('dragenter dragend dragleave dragover dragstart drag', 'a[href], img', (event) => {
  event.preventDefault();
});

export {};
