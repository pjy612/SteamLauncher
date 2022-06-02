import router from '../../instances/router';
import homeTemplate from './home.hbs?raw';

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
    const generatedTemplate = await window.api.app.handlebarsGenerate(homeTemplate);

    this.dom = $(generatedTemplate);
  }

  private async appendGamesList() {
    const gamesData = await window.api.games.getData();
    const $gamesList = this.dom.find('#games-list .card-body').empty();
    if (typeof gamesData !== 'undefined' && Object.keys(gamesData).length > 0) {
      const $gamesGrid = $('<div class="games-grid"></div>');
      $.each(gamesData, async (appId: string, { name }) => {
        const gamePaths = await window.api.game.getPaths(appId);
        const headerPath = gamePaths.appIdHeaderPath;

        const $gameCard = $(
          `<div class="card text-bg-st-secondary">
  <img class="card-img-top" src="${headerPath}" alt="${name}" />
  <div class="card-footer text-truncate text-center">${name}</div>
</div>`
        );

        const $gameContainer = $(
          `<div class="game-container" data-appId="${appId}" title="To open the context menu click on the right mouse button!">`
        ).append($gameCard);

        $gamesGrid.append($gameContainer);
      });
      $gamesList.append($gamesGrid);
    } else {
      $gamesList.html('<div class="text-center">You have not added any games yet!</div>');
    }
  }

  private setEvents() {
    this.dom.on('contextmenu', '.game-container', (event) => {
      const appId = $(event.currentTarget).attr('data-appId')!;
      window.api.game.openContextMenu(appId);
    });

    this.dom.find('#game-drop').fileDrop((file) => {
      const searchParameters = `?${new URLSearchParams(file).toString()}`;
      router.navigate(`/game/add/${searchParameters}`);
    });

    window.api.on('app-home-reload-games-list', async () => {
      await this.appendGamesList();
    });
  }

  private appendDom() {
    $('main').html(this.dom[0]);
  }
}

export default HomeView;
