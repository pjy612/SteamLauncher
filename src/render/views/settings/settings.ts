import settingsTemplate from './settings.hbs?raw';

class SettingsView {
  private dom = $('');

  public async show() {
    await this.setDom();
    this.appendDom();
    this.setEvents();
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

  private setEvents() {
    this.dom.on('click', 'button[data-sk="open-ludusavi"]', (event) => {
      event.preventDefault();
      window.api.app.openLudusavi();
    });
  }
}

export default SettingsView;
