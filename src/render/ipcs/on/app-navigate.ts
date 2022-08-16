import router from '../../instances/router';

window.api.on('app-navigate', (_event, to: string) => {
  router.navigate(to);
});
