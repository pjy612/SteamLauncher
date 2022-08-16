import { match } from 'path-to-regexp';

class Navigare {
  private routes: NavigareRoutesType = {};

  public constructor() {
    this.setEvents();
  }

  public navigate(path: string) {
    window.location.hash = this.cleanPath(path);
  }

  public resolve() {
    $(window).trigger('hashchange');
  }

  public on(path: string, callback: (match: NavigareMatchType) => void) {
    this.routes[path] = callback;
  }

  public getCurrentLocation() {
    return this.findRoute(window.location.hash);
  }

  private setEvents() {
    $(window).on('hashchange', () => this.tryNavigate(window.location.hash));

    $(document).on('click', 'a[data-navigare]', (event) => {
      event.preventDefault();

      const $dom = $(event.currentTarget);
      const href = $dom.attr('href');

      if (typeof href !== 'undefined') {
        this.navigate(href);
      }
    });
  }

  private findRoute(path: string) {
    const cleanedPath = this.cleanPath(path);
    const routes = Object.keys(this.routes)
      .sort((a, b) => b.length - a.length)
      .map((npath) => npath);

    for (const routePath of routes) {
      const matches = match(routePath, { decode: decodeURI, encode: encodeURI, sensitive: true })(cleanedPath);
      if (matches !== false) {
        const params = matches.params as Record<string, string>;
        const out: NavigareDataType = { path: routePath, params };
        return out;
      }
    }

    return undefined;
  }

  private tryNavigate(path: string) {
    const findRoute = this.findRoute(path);
    if (typeof findRoute !== 'undefined') {
      this.routes[findRoute.path](findRoute);
    } else {
      const cleanedPath = this.cleanPath(path);

      // eslint-disable-next-line no-console
      console.warn(`Navigare: 404 page ${cleanedPath} not found!`);
    }
  }

  private cleanPath(path: string) {
    let npath = path;
    npath = npath.startsWith('#') ? npath.slice(1) : npath;
    npath = npath.startsWith('/') ? npath : `/${npath}`;
    return npath;
  }
}

export default Navigare;
