import childProcess from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(childProcess.execFile);
const appExec = async (file: string, commandsLine: string[], cwd: string) => execFile(file, commandsLine, { cwd });

export default appExec;
