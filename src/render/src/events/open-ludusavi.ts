$(() => {
  $(document).on('click', 'button[data-sk="open-ludusavi"]', (event) => {
    event.preventDefault();
    window.api.app.openLudusavi();
  });
});

export {};
