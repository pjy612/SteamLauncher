import execFile from '../node/exec-file-promisify';
import paths from '../paths';

const signVerify = async (filePath: string) => {
  const exe = paths.files.signToolFile;
  try {
    await execFile(exe, ['verify', '/pa', filePath]);
    return true;
  } catch {
    return false;
  }
};

export default signVerify;
