import { spawnSync } from 'node:child_process';

const appSpawn = (command: string, commandsLine: string[], cwd: string) =>
  spawnSync(command, commandsLine, { encoding: 'utf8', cwd });

export default appSpawn;
