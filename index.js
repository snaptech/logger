const winston = require('winston');

const logger = new winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.File({
      filename: './logs/system.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      format: winston.format.json(),
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
      timestamp: true
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(10, true),
        winston.format.errors({stack: true}),
        winston.format.simple()
      )
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: './logs/unhandled.log',
      format: winston.format.json()
    }),
    new winston.transports.Console({
      format: winston.format.json()
    })
  ],
  exitOnError: false
});

const safeLog = (method, ...args) => {
  try {
    return logger[method](...args);
  } catch (err) {
    console.error(err);
    console.error(...args);
  }

  return null;
};

//proxied to abstract logger for easy library replacement
module.exports = {
  trace: (...args) => safeLog('debug', ...args),
  debug: (...args) => safeLog('debug', ...args),
  info: (...args) => safeLog('info', ...args),
  warn: (...args) => safeLog('warn', ...args),
  error: (...args) => safeLog('error', ...args)
};
