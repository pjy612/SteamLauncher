import Navigo from 'navigo';

const environments = import.meta.env;
const router = new Navigo('/', {
  hash: environments.PROD,
});

export default router;
