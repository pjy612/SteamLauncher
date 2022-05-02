import router from '../../instances/router';

class HomeView {
  private dom = $('');

  public async show() {
    await this.beforeHook();
    await this.setDom();
    await this.appendGamesList();
    this.setEvents();
    this.appendDom();
  }

  public async beforeHook() {
    if (!(await window.api.account.exist())) {
      router.navigate('/account/create');
    }
  }

  private async setDom() {
    const { default: html } = await import('./home.hbs?raw');
    const template = await window.api.app.handlebarsGenerate(html);
    this.dom = $(template);
  }

  private async appendGamesList() {
    const gamesData = await window.api.games.getData();
    const $gamesList = this.dom.find('#games-list .card-body').empty();
    if (typeof gamesData !== 'undefined' && Object.keys(gamesData).length > 0) {
      const $gamesGrid = $('<div class="games-grid"></div>');
      $.each(gamesData, async (appId: string, values) => {
        const paths = await window.api.game.getPaths(appId);
        const header = paths.appIdHeaderPath;
        const { name } = values;

        const gameContainer = $(`<div class="game-container" data-appId="${appId}"></div>`).attr(
          'title',
          'To open the context menu click on the right mouse button!'
        );
        $('<img>').attr('src', header).appendTo(gameContainer);
        $('<div>').text(name).appendTo(gameContainer);

        $gamesGrid.append(gameContainer);
      });
      $gamesList.append($gamesGrid);
    } else {
      $gamesList.html('<h1 class="text-center">You haven\'t entered any games yet!</h1>');
    }
  }

  private setEvents() {
    this.dom.on('contextmenu', '.game-container', (event) => {
      const appId = $(event.currentTarget).attr('data-appId') as string;
      window.api.game.openContextMenu(appId);
    });

    this.dom.find('#file-drop').fileDrop((file) => {
      const searchParameters = `?${new URLSearchParams(file).toString()}`;
      router.navigate(`/game/add/${searchParameters}`);
    });

    window.api.on('index-reload-games-list', () => {
      void this.appendGamesList();
    });
  }

  private appendDom() {
    $('main').html(this.dom[0]);
  }
}

export default HomeView;
