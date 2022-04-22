import { app } from 'electron';
import { argv } from 'node:process';

export const { DEV: appIsDevelopment, PROD: appIsProduction } = import.meta.env;

export const appCommandsLine = argv.slice(app.isPackaged ? 1 : 2);
