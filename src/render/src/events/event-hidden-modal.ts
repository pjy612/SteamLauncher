import navigo from '../instances/navigo';

$(() => {
  $(document).on('hidden.bs.modal', '.modal', (event) => {
    const dom = $(event.currentTarget);
    dom.modal('dispose');
    dom.remove();
    navigo.navigate('/');
  });
});
