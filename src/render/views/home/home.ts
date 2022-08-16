import steamLauncherImg from '@render/images/steamlauncher.svg';
import router from '@render/instances/router';
import homeTemplate from './home.hbs?raw';

class HomeView {
  private dom = $('');

  public async show() {
    await this.setDom();
    await this.appendGamesList();
    this.setEvents();
    this.setEventsIPC();
    this.appendDom();

    await HomeView.accountCheck();
  }

  public static async accountCheck() {
    if (!(await window.api.account.exist())) {
      router.navigate('/account/create');
    }
  }

  private async setDom() {
    const accountData = await window.api.account.getData();
    const accountName = typeof accountData !== 'undefined' ? accountData.name : 'Account';
    const networkStatus = await window.api.settings.getNetworkStatus();

    const contextTemplate = { accountName, networkStatus, steamLauncherImg };
    const generatedTemplate = await window.api.app.handlebarsGenerate(homeTemplate, contextTemplate);

    this.dom = $(generatedTemplate);
  }

  private async appendGamesList() {
    const gamesData = await window.api.games.getData();
    const $gamesList = this.dom.find('#games-list').empty();
    if (typeof gamesData !== 'undefined' && Object.keys(gamesData).length > 0) {
      const $gamesGrid = $('<div class="games-grid"></div>');
      $.each(gamesData, (appId: string, { name, paths }) => {
        const { headerFilePath } = paths;
        const $gameContainer = $(`<div class="game-container">
  <img
    class="game-container-img"
    src="${headerFilePath}"
    alt="Game Header ${name}"
    data-appId="${appId}"
    data-bs-toggle="tooltip"
    title="To open context menu of the game, use the right-click of the mouse."
  />
</div>`);
        $gamesGrid.append($gameContainer);
      });
      $gamesList.append($gamesGrid);
    } else {
      $gamesList.html('<div class="text-center text-white">You have not added any games yet!</div>');
    }
  }

  private setEvents() {
    this.dom.on('contextmenu', '.game-container-img', (event) => {
      const appId = $(event.currentTarget).attr('data-appId');
      if (typeof appId !== 'undefined') {
        window.api.game.openContextMenu(appId);
      }
    });

    // ST NAV MENU - ADD GAME
    this.dom.find('*[data-sk="add-game"]').fileDrop((file) => {
      router.navigate(`/game/add/${JSON.stringify(file)}`);
    });

    // ST NAV MENU - SET NETWORK
    this.dom.on('click', 'button[data-sk="set-network"]', (event) => {
      event.preventDefault();

      const dom = $(event.currentTarget);
      const isMode = dom.attr('data-sk-isMode');
      const toMode = isMode === 'online' ? 'offline' : 'online';

      dom.attr('data-sk-isMode', toMode);

      window.api.settings.setNetworkStatus(toMode);
    });

    // ST NAV TITLEBAR
    window.api.on('window-state-change', (_event, isMaximized: boolean) => {
      $(document.body).toggleClass('window-is-maximized', isMaximized);
    });

    this.dom.on('click', 'button[data-sk="titlebar"]', (event) => {
      event.preventDefault();

      const fn = $(event.currentTarget).attr('data-sk-fn');
      switch (fn) {
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

  private setEventsIPC() {
    window.api.on('app-home-reload-games-list', () => this.appendGamesList());
  }

  private appendDom() {
    $('#app').empty().append(this.dom);
  }
}

export default HomeView;
