import * as fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
// winston.cli();
let dir = 'runtime/logs/';

if (!dir) dir = path.resolve('logs');

console.log(dir);
// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

const myFormat = format.printf(
  ({
    level,
    message,
    timestamp,
    ModuleName,
  }: {
    level: string;
    message: string;
    timestamp: string;
    ModuleName: string;
  }) => {
    return `${timestamp} | ${level} | ${ModuleName} | ${message}  `;
  },
);

const Options = {
  errorFile: {
    level: 'error',
    filename: dir + 'logs/' + 'error/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: '20m',
    colorize: true,
    maxFiles: '14d',
    format: myFormat,
  },
  accessFile: {
    level: 'debug',
    filename: dir + 'logs/' + 'access/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: '20m',
    colorize: true,
    maxFiles: '14d',
    format: myFormat,
  },
};

const Logger = {
  error: createLogger({
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.prettyPrint(),
    ),
    transports: [
      new DailyRotateFile(Options.errorFile),
      new transports.Console({ format: myFormat }),
    ],
  }),
  access: createLogger({
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.prettyPrint(),
    ),
    transports: [
      new DailyRotateFile(Options.accessFile),
      new transports.Console({ format: myFormat }),
    ],
  }),
};

export default Logger;
