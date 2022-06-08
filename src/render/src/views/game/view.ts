import allowedLanguages from '../../configs/allowed-languages';
import router from '../../instances/router';
import gameTemplate from './game.hbs?raw';

class GameView {
  private dom = $('');
  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    await this.setDom();
    this.appendDom();
  }

  private async setDom() {
    const contextTemplate = {
      isEditMode: this.isEditMode,
      allowedLanguages,
    };
    const getCurrentLocationInfo = router.getCurrentLocationInfo();

    if (this.isEditMode) {
      const appId = getCurrentLocationInfo?.data?.appId;
      const gameData = await window.api.game.getData(appId!);

      Object.assign(contextTemplate, {
        gameData,
      });
    } else {
      Object.assign(contextTemplate, {
        gameDataFromExe: getCurrentLocationInfo?.search,
      });
    }

    const generatedTemplate = await window.api.app.handlebarsGenerate(gameTemplate, contextTemplate);
    this.dom = $(generatedTemplate);
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }
}

export default GameView;
