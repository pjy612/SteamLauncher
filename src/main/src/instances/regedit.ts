import regedit from 'regedit';
import paths from '../paths';

regedit.setExternalVBSLocation(paths.appRegeditVbsPath);

export default regedit.promisified;
