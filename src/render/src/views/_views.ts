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
  // nada
});

const aboutController = new AboutView();
router.on('/about', async () => {
  await aboutController.show();
});

const accountController = new AccountView();
router.on('/account/create', async () => {
  await accountController.show();
});

router.on('/account/edit', async () => {
  await accountController.show(true);
});

const settingsController = new SettingsView();
router.on('/settings', async () => {
  await settingsController.show();
});

const gameController = new GameView();
router.on('/game/add', async () => {
  await gameController.show();
});

router.on('/game/edit/:appId', async () => {
  await gameController.show(true);
});
