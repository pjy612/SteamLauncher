import type { ChildProcess } from 'node:child_process';

import log from '../instances/log';
import execFile from '../node/exec-file-promisify';
import paths from '../paths';

const signVerify = async (filePath: string) => {
  const exe = paths.files.signToolFile;
  try {
    await execFile(exe, ['verify', '/pa', filePath]);
    return true;
  } catch (error) {
    const { stderr } = error as ChildProcess;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    log.error(`signVerify: ${stderr}`);
    return false;
  }
};

export default signVerify;
