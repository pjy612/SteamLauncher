import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/js/dist/tab';
import router from './router';

$(() => {
  $(document.body).tooltip({
    container: 'body',
    selector: '*[data-bs-toggle="tooltip"]',
    html: true,
  });

  $(document).on('hidden.bs.modal', '.modal', (event) => {
    $(event.currentTarget).remove();
    router.navigate('/');
  });
});
