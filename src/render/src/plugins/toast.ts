import {productName} from '../../../../package.json';

(($) => {
  const toastContainer = `<div aria-live="polite" aria-atomic="true" class="position-relative"><div class="toast-container absolute bottom-0 right-0 m-3"></div></div>`;
  const toastStack = 3;

  $(document).on('hidden.bs.toast', '.toast', function () {
    $(this).toast('dispose');
    $(this).remove();
  });

  $.snack = (content, type, delay = 3000) => {
    if ($('.toast-container').length === 0) {
      $(toastContainer).appendTo('body');
    }

    const container = $('.toast-container');
    const icons: Record<string, string> = {
      info: 'mdi-alert-circle',
      success: 'mdi-check-circle',
      warning: 'mdi-alert-decagram',
      error: 'mdi-alert',
    };
    const types: Record<string, string> = {
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning',
      error: 'toast-error',
    };

    if (container.find('> .toast').length > toastStack) {
      container.find('> .toast:first-child').toast('hide');
    }

    const html =
      $(`<div class="toast ${types[type]}" data-bs-delay="${delay}" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <div class="toast-header-left">
      <span class="mdi ${icons[type]}"></span>
      <span>${productName}</span>
    </div>
    <div class="toast-header-right">
      <button type="button" data-bs-dismiss="toast">
        <span class="mdi mdi-close"></span>
      </button>
    </div>
  </div>
  <div class="toast-body">${content}</div>
</div>`);

    html.appendTo(container);
    html.toast('show');
  };
})(jQuery);
