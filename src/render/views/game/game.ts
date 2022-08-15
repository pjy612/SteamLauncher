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
    const getCurrentLocationInfo = router.getCurrentLocation();

    if (this.isEditMode) {
      const parameterAppId = getCurrentLocationInfo?.params.appId;
      if (typeof parameterAppId !== 'undefined') {
        const gameData = await window.api.game.getData(parameterAppId);
        Object.assign(contextTemplate, {
          gameData,
        });
      }
    } else {
      const parameterData = getCurrentLocationInfo?.params.data;
      if (typeof parameterData !== 'undefined') {
        Object.assign(contextTemplate, {
          gameDataFromExe: JSON.parse(parameterData) as Record<string, unknown>,
        });
      }
    }

    const generatedTemplate = await window.api.app.handlebarsGenerate(gameTemplate, contextTemplate);
    this.dom = $(generatedTemplate);
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }
}

export default GameView;
