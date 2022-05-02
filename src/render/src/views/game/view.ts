import allowedLanguages from '../../configs/allowed-languages';
import router from '../../instances/router';

class GameView {
  private dom = $('');

  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    await this.setDom();
    this.appendDom();
  }

  private async setDom() {
    const view = {
      isEditMode: this.isEditMode,
      allowedLanguages,
    };
    const getCurrentLocationInfo = router.getCurrentLocationInfo();

    if (this.isEditMode) {
      const appId = getCurrentLocationInfo?.data?.appId;
      const gameData = await window.api.game.getData(appId!);

      Object.assign(view, {
        data: gameData,
      });
    } else {
      Object.assign(view, {
        parameters: getCurrentLocationInfo?.search,
      });
    }

    const { default: html } = await import('./game.hbs?raw');
    const template = await window.api.app.handlebarsGenerate(html, view);
    this.dom = $(template);
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }
}

export default GameView;
