import { pathExistsSync } from 'fs-extra';
import paths from '../paths';

const appIsInstalled = () => {
  // TODO: It's the only way i've found to check if the app is portable or installed.
  return pathExistsSync(paths.files.uninstallFile);
};

export default appIsInstalled;
