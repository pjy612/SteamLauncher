class SettingsView {
  private dom = $('');

  public async show() {
    await this.setDom();
    this.appendDom();
  }

  private async setDom() {
    const settingsData = await window.api.settings.getData();
    const { default: html } = await import('./settings.hbs?raw');
    const template = await window.api.app.handlebarsGenerate(html, {
      data: settingsData,
    });
    this.dom = $(template);
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }
}

export default SettingsView;
