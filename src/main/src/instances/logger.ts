import { app } from 'electron';
import { transports, format, createLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import paths from '../configs/paths';

const loggerFormatString = format.printf(
  ({ level, timestamp, message }) => `[${timestamp as string}] [${level}]: ${message}`
);
const loggerFormatTimestamp = 'YYYY-MM-DD hh:mm:ss.SSS';

const logger = createLogger({
  level: 'silly',
  format: format.combine(format.timestamp({ format: loggerFormatTimestamp }), loggerFormatString),
});

logger.add(
  new DailyRotateFile({
    filename: paths.logs.filePath,
    dirname: paths.logs.rootPath,
    maxFiles: '14d',
  })
);

if (!app.isPackaged) {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: loggerFormatTimestamp }),
        loggerFormatString
      ),
    })
  );
}

export default logger;
