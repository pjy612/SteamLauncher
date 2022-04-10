import mustache from 'mustache';
import { allowedLanguages } from '../../config';
import mustacheObjsWithKeys from '../../functions/mustache-objs-with-keys';

class AccountView {
  private dom: JQuery | undefined;

  private accountData: StoreAccountType | undefined;

  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    if (this.isEditMode) {
      await this.setData();
    }

    await this.setDom();
    this.afterSetDom();
    this.appendDom();
  }

  private async setData() {
    this.accountData = await window.api.account.getData();
  }

  private async setDom() {
    // eslint-disable-next-line node/no-missing-import
    const { default: html } = await import('./account.html?raw');
    const view = {
      inputLanguages: mustacheObjsWithKeys(allowedLanguages),
      isEditMode: this.isEditMode,
    };
    if (this.isEditMode) {
      Object.assign(view, {
        accountData: this.accountData,
      });
    } else {
      const steamId = await window.api.account.getRandomSteamId();
      Object.assign(view, {
        accountData: {
          steamId,
        },
      });
    }

    const rendered = mustache.render(html, view);
    this.dom = $(rendered);
  }

  private afterSetDom() {
    if (this.isEditMode) {
      this.dom?.find('select[name="language"]').val(this.accountData!.language);
    }
  }

  private appendDom() {
    if (!this.isEditMode) {
      this.dom?.attr({
        'data-bs-backdrop': 'static',
        'data-bs-keyboard': 'false',
      });
    }

    this.dom?.appendTo(document.body).modal('show');
  }
}

export default AccountView;
