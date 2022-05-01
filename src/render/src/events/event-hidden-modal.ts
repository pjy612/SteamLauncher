import router from '../instances/router';

$(() => {
  $(document).on('hidden.bs.modal', '.modal', (event) => {
    const dom = $(event.currentTarget);
    dom.modal('dispose');
    dom.remove();
    router.navigate('/');
  });
});
