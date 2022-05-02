$(() => {
  $(document).on('click', 'button[data-sk="open-ludusavi"]', async (event) => {
    event.preventDefault();
    await window.api.app.openLudusavi();
  });
});

export {};
