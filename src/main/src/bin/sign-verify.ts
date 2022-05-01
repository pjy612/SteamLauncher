import type { ChildProcess } from 'node:child_process';
import log from '../instances/log';
import execFile from '../node/exec-file-promisify';
import paths from '../paths';

const signVerify = async (filePath: string) => {
  const exe = paths.files.signToolFilePath;
  try {
    await execFile(exe, ['verify', '/pa', filePath]);
    return true;
  } catch (error) {
    const { stderr } = error as ChildProcess;
    log.error(`signVerify: ${stderr!.toString()}`);
    return false;
  }
};

export default signVerify;
