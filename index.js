const winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/system.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
      timestamp: true
    }),
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true,
      humanReadableUnhandledException: false,
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: false
});

const safeLog = (method, ...args) => {
  try {
    return logger[method](...args);
  } catch (err) {
    console.error(err);
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
