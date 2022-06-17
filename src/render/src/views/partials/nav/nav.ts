import navTemplate from './nav.hbs?raw';

class NavPartialView {
  private dom = $('');

  public async show() {
    await this.setDom();
    this.setEvents();
    this.appendDom();
  }

  private async setDom() {
    const contextTemplate = {
      networkStatus: await window.api.settings.getNetworkStatus(),
      version: await window.api.app.getVersion(),
    };
    const generatedTemplate = await window.api.app.handlebarsGenerate(navTemplate, contextTemplate);

    this.dom = $(generatedTemplate);
  }

  private setEvents() {
    // SET NETWORK
    this.dom.on('click', 'button[data-sk="set-network"]', (event) => {
      event.preventDefault();

      const dom = $(event.currentTarget);
      const isMode = dom.attr('data-sk-isMode')!;
      const toMode = isMode === 'online' ? 'offline' : 'online';

      dom.attr('data-sk-isMode', toMode);

      window.api.settings.setNetworkStatus(toMode);
    });

    // TITLEBAR
    window.api.on('window-state-change', (_event, isMaximized: boolean) => {
      $(document.body).toggleClass('window-is-maximized', isMaximized);
    });

    this.dom.on('click', 'button[data-sk="titlebar"]', (event) => {
      event.preventDefault();

      const function_ = $(event.currentTarget).attr('data-sk-fn')!;
      switch (function_) {
        case 'minimize':
          window.api.window.minimize();
          break;
        case 'maximize':
          window.api.window.maximize();
          break;
        case 'restore':
          window.api.window.restore();
          break;
        case 'close':
          window.api.window.close();
          break;
        default:
          break;
      }
    });
  }

  private appendDom() {
    this.dom.insertBefore('main');
  }
}

export default NavPartialView;
