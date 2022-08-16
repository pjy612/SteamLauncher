import router from '../instances/router';
import AboutView from './about/about';
import AccountView from './account/account';
import GameView from './game/game';
import HomeView from './home/home';
import SettingsView from './settings/settings';
import ConsolePartialView from './partials/console/console';

const consolePartialController = new ConsolePartialView();
$(async () => {
  await consolePartialController.show();
});

router.on('/', async () => {
  const homeController = new HomeView();
  await homeController.show();
});

router.on('/about', async () => {
  await new AboutView().show();
});

router.on('/account/create', async () => {
  await new AccountView().show();
});

router.on('/account/edit', async () => {
  await new AccountView().show(true);
});

router.on('/settings', async () => {
  await new SettingsView().show();
});

router.on('/game/add/:data', async () => {
  await new GameView().show();
});

router.on('/game/edit/:appId', async () => {
  await new GameView().show(true);
});

router.resolve();
