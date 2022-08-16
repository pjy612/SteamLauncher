import steamLauncherImg from '@render/images/steamlauncher.svg';
import sak32009Img from '@render/images/sak32009.svg';
import aboutTemplate from './about.hbs?raw';

class AboutView {
  private dom = $('');

  public async show() {
    await this.setDom();
    this.appendDom();
  }

  private async setDom() {
    const version = await window.api.app.getVersion();
    const description = await window.api.app.getDescription();
    const copyright = await window.api.app.getCopyright();

    const contextTemplate = { version, description, copyright, steamLauncherImg, sak32009Img };
    const generatedTemplate = await window.api.app.handlebarsGenerate(aboutTemplate, contextTemplate);

    this.dom = $(generatedTemplate);
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }
}

export default AboutView;
