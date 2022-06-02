import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/tab';
import router from './router';

$(() => {
  $(document).on('hidden.bs.modal', '.modal', (event) => {
    $(event.currentTarget).remove();
    router.navigate('/');
  });
});
