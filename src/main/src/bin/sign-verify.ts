import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { paths } from '../config';

const signVerify = async (filePath: string) => {
  const exe = paths.signToolBin;
  try {
    await promisify(execFile)(exe, ['verify', '/pa', filePath]);
    return true;
  } catch {
    return false;
  }
};

export default signVerify;
