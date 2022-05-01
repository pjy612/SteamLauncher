import mustache from 'mustache';

class SettingsView {
  private dom = $('');

  private settingsData: StoreSettingsType | undefined;

  public async show() {
    await this.setData();
    await this.setDom();
    this.appendDom();
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

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }
}

export default SettingsView;
