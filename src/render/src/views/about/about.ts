import aboutTemplate from './about.hbs?raw';

class AboutView {
  private dom = $('');

  public async show() {
    await this.setDom();
    this.appendDom();
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }

  private async setDom() {
    const version = await window.api.app.getVersion();
    const description = await window.api.app.getDescription();
    const copyright = await window.api.app.getCopyright();

    const contextTemplate = { version, description, copyright };
    const generatedTemplate = await window.api.app.handlebarsGenerate(aboutTemplate, contextTemplate);

    this.dom = $(generatedTemplate);
  }
}

export default AboutView;
