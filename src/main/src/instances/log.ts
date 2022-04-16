import { join } from 'node:path';
import { app } from 'electron';
import { transports, format, createLogger } from 'winston';
import { appIsDevelopment } from '../environments';
import paths from '../paths';

const logFormatString = format.printf(({ level, timestamp, message }) => {
  return `[${timestamp as string}] [${level}]: ${message}`;
});
const logFormatTimestamp = 'YYYY-MM-DD hh:mm:ss.SSS';
const logFilePath = join(paths.appLogsPath, `${app.getName()}.log`);

const log = createLogger({
  // max level
  level: 'silly',
  transports: [
    new transports.File({
      filename: logFilePath,
      maxFiles: 10,
      // 5mb
      maxsize: 5_242_880,
      tailable: true,
      format: format.combine(format.timestamp({ format: logFormatTimestamp }), logFormatString),
    }),
  ],
});

if (appIsDevelopment) {
  log.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: logFormatTimestamp }),
        logFormatString
      ),
    })
  );
}

export default log;
