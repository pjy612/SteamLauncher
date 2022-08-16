import consoleTemplate from './console.hbs?raw';

class ConsolePartialView {
  private dom = $('');

  private readonly classConsoleHideAll = 'console-hide-all';

  private readonly classConsoleHideMe = 'console-hide-me';

  public async show() {
    await this.setDom();
    this.setEvents();
  }

  private async setDom() {
    const generatedTemplate = await window.api.app.handlebarsGenerate(consoleTemplate);

    this.dom = $(generatedTemplate);
  }

  private insertText(txt: string, space = false) {
    const line = `> - ${space ? '   ' : ''}${txt}`;

    const textarea = this.dom.find('textarea');
    const textareaValue = textarea.val() as string;
    const textareaNewValue = `${textareaValue}${line}\r\n`;

    const textareaHeight = textarea.height() as number;
    const textareaScrollHeight = textarea.prop('scrollHeight') as number;
    const textareaScrollTo = textareaScrollHeight - textareaHeight;

    textarea.val(textareaNewValue).scrollTop(textareaScrollTo);
  }

  private appendDom() {
    this.dom.appendTo(document.body).modal('show');
  }

  private setEvents() {
    window.api.on('console-show', () => {
      this.dom.find('textarea').val('');
      this.appendDom();
    });

    window.api.on('console-hide', (_event, isOk: boolean) => {
      this.dom.addClass(isOk ? this.classConsoleHideAll : this.classConsoleHideMe);

      this.insertText('');
      this.insertText('');
      this.insertText('PRESS "C" TO CLOSE CONSOLE...');
    });

    window.api.on('console-add', (_event, txt: string, space = false) => {
      this.insertText(txt, space as boolean);
    });

    $(window).on('keyup', (event) => {
      if (event.key === 'c') {
        if (this.dom.hasClass(this.classConsoleHideAll)) {
          this.dom.removeClass(this.classConsoleHideAll);
          $('.modal').modal('hide');
        } else if (this.dom.hasClass(this.classConsoleHideMe)) {
          this.dom.removeClass(this.classConsoleHideMe);
          this.dom.modal('hide');
        }
      }
    });
  }
}

export default ConsolePartialView;
