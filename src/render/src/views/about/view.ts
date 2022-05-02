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
    const name = await window.api.app.getName();
    const version = await window.api.app.getVersion();
    const description = await window.api.app.getDescription();
    const copyright = await window.api.app.getCopyright();

    const { default: html } = await import('./about.hbs?raw');
    const template = await window.api.app.handlebarsGenerate(html, {
      copyright,
      description,
      name,
      version,
    });
    this.dom = $(template);
  }
}

export default AboutView;
