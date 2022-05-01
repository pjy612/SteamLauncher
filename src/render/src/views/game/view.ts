import mustache from 'mustache';
import allowedLanguages from '../../configs/allowed-languages';
import mustacheObjsWithKeys from '../../functions/mustache-objs-with-keys';
import router from '../../instances/router';

class GameView {
  private dom = $('');
  private gameData: StoreGameDataType | undefined;
  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    await this.setDom();
    this.afterSetDom();
    this.appendDom();
  }

  private async setDom() {
    const view = {
      inputLanguages: mustacheObjsWithKeys(allowedLanguages),
    };

    const getCurrentLocationInfo = router.getCurrentLocationInfo();

    if (this.isEditMode) {
      const appId = getCurrentLocationInfo?.data?.appId;

      this.gameData = await window.api.game.getData(appId!);

      Object.assign(view, {
        data: this.gameData,
        isEditMode: this.isEditMode,
      });
    } else {
      Object.assign(view, {
        parameters: getCurrentLocationInfo?.search,
      });
    }

    const { default: html } = await import('./game.html?raw');
    const rendered = mustache.render(html, view);
    this.dom = $(rendered);
  }

  private afterSetDom() {
    if (
      this.isEditMode &&
      typeof this.gameData !== 'undefined' &&
      this.gameData.forceAccountLanguage.length > 0
    ) {
      this.dom.find('select[name="forceAccountLanguage"]').val(this.gameData.forceAccountLanguage);
    }
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }
}

export default GameView;
