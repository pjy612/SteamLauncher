import router from '../instances/router';
import AboutView from './about/view';
import AccountView from './account/view';
import GameView from './game/view';
import HomeView from './home/view';
import SettingsView from './settings/view';
import NavPartialView from './partials/nav/view';
import ConsolePartialView from './partials/console/view';

const homeController = new HomeView();
const navPartialController = new NavPartialView();
const consolePartialController = new ConsolePartialView();
$(async () => {
  await navPartialController.show();
  await consolePartialController.show();
  await homeController.show();
});

router.on('/', () => {
  // it is useful for modals
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
