// TODO: IMPROVE
/* eslint-disable no-console */
const iteratorToObject = (nn: URLSearchParams) => {
  const b: Record<string, string> = {};
  for (const pp of nn) {
    const { 0: key, 1: value } = pp;
    b[key] = value;
  }

  return b;
};

class Navigare {
  private routes: NavigareRoutesType = {};

  public constructor() {
    this._listen();
  }

  public on(path: string, callback: (match: NavigareMatchDataType) => void) {
    this.routes[path] = callback;
  }

  public navigate(path: string) {
    const cleanedPath = this._cleanPath(path);

    // eslint-disable-next-line unicorn/no-null
    window.history.replaceState(null, '', `/#${cleanedPath}`);

    $(window).trigger('hashchange');
  }

  public getCurrentLocationInfo(): NavigareMatchDataType {
    const findRoute = this._findRoute(window.location.hash);
    return findRoute.exists
      ? {
          data: findRoute.data,
          search: findRoute.search,
        }
      : undefined;
  }

  private _listen() {
    $(window).on('hashchange', () => {
      this._tryNavigate(window.location.hash);
    });

    $(() => {
      $(window).trigger('hashchange');
    });

    $(document).on('click', 'a[data-navigare]', (event) => {
      event.preventDefault();

      const $dom = $(event.currentTarget);
      const href = $dom.attr('href') as string;

      this.navigate(href);
    });
  }

  private _findRoute(path: string): NavigareMatchType {
    const cleanedPath = this._cleanPath(path);
    const fakeUrl = this._fakeUrl(path);
    const routes = Object.keys(this.routes)
      .sort((a, b) => b.length - a.length)
      .map((npath) => npath);

    for (const routePath of routes) {
      if (cleanedPath === routePath) {
        return {
          path: routePath,
          data: undefined,
          search: fakeUrl.search,
          exists: true,
        };
      }

      if (routePath !== '/') {
        const re = new RegExp(routePath.replace(/:\w+/gu, '(?<$&>\\w+)').replace('<:', '<'), 'gu');
        const matches = [...cleanedPath.matchAll(re)][0];
        if (typeof matches !== 'undefined') {
          return {
            path: routePath,
            data: matches.groups,
            search: fakeUrl.search,
            exists: true,
          };
        }
      }
    }

    console.warn(`Navigare: 404 page ${cleanedPath} not found`);
    return {
      path: '',
      data: undefined,
      search: fakeUrl.search,
      exists: false,
    };
  }

  private _tryNavigate(path: string) {
    const findRoute = this._findRoute(path);
    if (findRoute.exists) {
      this.routes[findRoute.path]({
        data: findRoute.data,
        search: findRoute.search,
      });
    }
  }

  private _fakeUrl(path: string) {
    const cleanedPath = this._cleanPath(path);
    const fakeUrl = new URL(`http://x.y${cleanedPath}`);
    const searchParameters = fakeUrl.searchParams;
    return {
      search: iteratorToObject(searchParameters),
    };
  }

  private _cleanPath(path: string) {
    let npath = path;
    npath = npath.startsWith('#') ? npath.slice(1) : npath;
    npath = npath.startsWith('/') ? npath : `/${npath}`;
    return npath;
  }
}

export default Navigare;
