import mustache from 'mustache';

class AboutView {
  private dom: JQuery | undefined;

  public async show() {
    await this.setDom();
    this.appendDom();
  }

  private appendDom() {
    this.dom?.appendTo(document.body).modal('show');
  }

  private async setDom() {
    const name = await window.api.app.getName();
    const version = await window.api.app.getVersion();
    const description = await window.api.app.getDescription();
    const copyright = await window.api.app.getCopyright();
    // eslint-disable-next-line node/no-missing-import
    const { default: html } = await import('./about.html?raw');
    const rendered = mustache.render(html, {
      copyright,
      description,
      name,
      version,
    });
    this.dom = $(rendered);
  }
}

export default AboutView;
