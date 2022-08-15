import { app } from 'electron';
import util from 'node:util';
import { transports, format, createLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import paths from '../configs/paths';

const loggerFormatString = format.printf(
  ({ level, timestamp, custom, message }) =>
    `[${timestamp as string}] [${level}]${
      typeof custom !== 'undefined' ? ` [${(custom as string).toUpperCase()}]` : ''
    }: ${message}`
);
const loggerFormatTimestamp = format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS' });
const loggerFormat = format.combine(loggerFormatTimestamp, loggerFormatString);
const loggerDailyRotateFile = new DailyRotateFile({
  filename: paths.logs.filePath,
  dirname: paths.logs.rootPath,
  maxFiles: '14d',
});

const loggerInstance = createLogger({
  level: 'silly',
  format: loggerFormat,
  transports: [loggerDailyRotateFile],
});

if (!app.isPackaged) {
  loggerInstance.add(
    new transports.Console({
      format: format.combine(format.colorize(), loggerFormat),
    })
  );
}

const logger = {
  info: (label: string | undefined, ...data: unknown[]) => loggerInstance.info(util.format(...data), { custom: label }),
  debug: (label: string | undefined, ...data: unknown[]) =>
    loggerInstance.debug(util.format(...data), { custom: label }),
  error: (label: string | undefined, ...data: unknown[]) =>
    loggerInstance.error(util.format(...data), { custom: label }),
  warn: (label: string | undefined, ...data: unknown[]) => loggerInstance.warn(util.format(...data), { custom: label }),
};

export default logger;
