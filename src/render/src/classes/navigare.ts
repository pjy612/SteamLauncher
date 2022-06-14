import { match } from 'path-to-regexp';

class Navigare {
  private routes: NavigareRoutesType = {};

  public constructor() {
    this._setEvents();
  }

  public navigate(path: string) {
    window.location.hash = this._cleanPath(path);
  }

  public resolve() {
    $(window).trigger('hashchange');
  }

  public on(path: string, callback: (match: NavigareMatchType) => void) {
    this.routes[path] = callback;
  }

  public getCurrentLocation() {
    return this._findRoute(window.location.hash);
  }

  private _setEvents() {
    $(window).on('hashchange', () => this._tryNavigate(window.location.hash));

    $(document).on('click', 'a[data-navigare]', (event) => {
      event.preventDefault();

      const $dom = $(event.currentTarget);
      const href = $dom.attr('href')!;

      this.navigate(href);
    });
  }

  private _findRoute(path: string) {
    const cleanedPath = this._cleanPath(path);
    const routes = Object.keys(this.routes)
      .sort((a, b) => b.length - a.length)
      .map((npath) => npath);

    for (const routePath of routes) {
      const matches = match(routePath, { decode: decodeURI, encode: encodeURI, sensitive: true })(cleanedPath);
      if (matches !== false) {
        return { path: routePath, params: matches.params } as NavigareDataType;
      }
    }

    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  private _tryNavigate(path: string) {
    const findRoute = this._findRoute(path);
    if (typeof findRoute !== 'undefined') {
      this.routes[findRoute.path](findRoute);
    } else {
      const cleanedPath = this._cleanPath(path);
      /* eslint-disable no-console */
      console.warn(`Navigare: 404 page ${cleanedPath} not found!`);
    }
  }

  private _cleanPath(path: string) {
    let npath = path;
    npath = npath.startsWith('#') ? npath.slice(1) : npath;
    npath = npath.startsWith('/') ? npath : `/${npath}`;
    return npath;
  }
}

export default Navigare;
