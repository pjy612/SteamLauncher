import settingsTemplate from './settings.hbs?raw';

class SettingsView {
  private dom = $('');

  public async show() {
    await this.setDom();
    this.appendDom();
  }

  private async setDom() {
    const settingsData = await window.api.settings.getData();

    const contextTemplate = { settingsData };
    const generatedTemplate = await window.api.app.handlebarsGenerate(settingsTemplate, contextTemplate);

    this.dom = $(generatedTemplate);
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }
}

export default SettingsView;
