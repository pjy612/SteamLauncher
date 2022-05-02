import handlebars from '../../instances/handlebars';
import allowedLanguages from '../../configs/allowed-languages';

class AccountView {
  private dom = $('');

  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    await this.setDom();
    this.appendDom();
  }

  private async setDom() {
    const view = {
      isEditMode: this.isEditMode,
      allowedLanguages,
    };

    if (this.isEditMode) {
      const accountData = await window.api.account.getData();
      Object.assign(view, {
        data: accountData,
      });
    } else {
      const steamId = await window.api.account.getRandomSteamId();
      Object.assign(view, {
        data: {
          steamId,
        },
      });
    }

    const { default: html } = await import('./account.hbs?raw');
    const compile = handlebars.compile(html);
    const template = compile(view);
    this.dom = $(template);
  }

  private appendDom() {
    if (!this.isEditMode) {
      this.dom.attr({
        'data-bs-backdrop': 'static',
        'data-bs-keyboard': 'false',
      });
    }

    this.dom.appendTo(document.body).modal('show');
  }
}

export default AccountView;
