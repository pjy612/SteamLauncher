import mustache from 'mustache';

import iteratorToObject from '../../functions/iterator-to-object';
import navigo from '../../instances/navigo';

class GameView {
  private dom: JQuery | undefined;

  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    await this.setDom();
    this.appendDom();
  }

  private appendDom() {
    this.dom?.appendTo(document.body).modal('show');
  }

  private async setDom() {
    const { default: html } = await import('./game.html?raw');

    let view = {};
    const { 0: current } = navigo.current!;
    const appId = current.data?.appId;
    const { queryString } = current;

    if (this.isEditMode) {
      const data = await window.api.game.getData(appId!);
      view = {
        data,
        isEditMode: this.isEditMode,
      };
    } else {
      const parameters = iteratorToObject(new URLSearchParams(queryString));
      view = {
        parameters,
      };
    }

    const rendered = mustache.render(html, view);
    this.dom = $(rendered);
  }
}

export default GameView;
