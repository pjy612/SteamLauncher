import router from '../../instances/router';

window.api.on('app-navigate-to', (_event, to: string) => {
  router.navigate(to);
});
