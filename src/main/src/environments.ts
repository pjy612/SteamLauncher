import { argv } from 'node:process';
import { app } from 'electron';

export const { DEV: appIsDevelopment, PROD: appIsProduction } = import.meta.env;

export const appCommandsLine = argv.slice(app.isPackaged ? 1 : 2);
