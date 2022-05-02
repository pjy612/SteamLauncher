import mustache from 'mustache';

class SettingsView {
  private dom = $('');

  private settingsData: StoreSettingsType | undefined;

  public async show() {
    await this.setData();
    await this.setDom();
    this.appendDom();
    this.afterSetDom();
  }

  private async setData() {
    this.settingsData = await window.api.settings.getData();
  }

  private async setDom() {
    const { default: html } = await import('./settings.html?raw');
    const rendered = mustache.render(html, {
      data: this.settingsData,
    });
    this.dom = $(rendered);
  }

  private afterSetDom() {
    this.dom
      .find('select[name="httpsRejectUnauthorized"]')
      .val(this.settingsData!.httpsRejectUnauthorized.toString());
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }
}

export default SettingsView;
