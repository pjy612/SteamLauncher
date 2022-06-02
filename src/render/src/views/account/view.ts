import allowedLanguages from '../../configs/allowed-languages';
import accountTemplate from './account.hbs?raw';

class AccountView {
  private dom = $('');

  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    await this.setDom();
    this.appendDom();
  }

  private async setDom() {
    const contextTemplate = {
      isEditMode: this.isEditMode,
      allowedLanguages,
    };
    let accountData;

    if (this.isEditMode) {
      accountData = await window.api.account.getData();
    } else {
      const steamId = await window.api.account.getRandomSteamId();
      accountData = { steamId };
    }

    Object.assign(contextTemplate, {
      accountData,
    });

    const generatedTemplate = await window.api.app.handlebarsGenerate(accountTemplate, contextTemplate);

    this.dom = $(generatedTemplate);
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
