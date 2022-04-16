import navigo from '../../instances/navigo';

window.api.on('app-navigate-to', (_event, to: string) => {
  navigo.navigate(to);
});
