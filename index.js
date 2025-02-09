import winston from 'winston';
import jsonStringify from 'json-stringify-safe';
import {customConsoleFormatter} from './custom-console-formatter';
import {customJSONFormatter} from './custom-json-formatter';
import Buffer from 'node:buffer';


const loggerConsole = new winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(
         winston.format.colorize(),
         winston.format.timestamp(),
         winston.format.errors({stack: true}),
         customConsoleFormatter()
         //winston.format.prettyPrint({depth: 10, colorize: true}),
      )
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      format: winston.format.json()
    })
  ],
  exitOnError: false
});

const loggerFile = new winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.File({
      filename: './logs/system.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        customJSONFormatter()
      ),
      maxsize: 5242880, //5MB
      maxFiles: 5
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: './logs/unhandled.log',
      format: winston.format.json()
    })
  ],
  exitOnError: false
});

const safeLog = (method, ...args) => {
  try {
    let message = '';
    let jsonMessage = '';
    let exit = false;

    (args || []).forEach((v) => {
      if (v && (v.toString().indexOf('GET: /healthy') >= 0
          || v.toString().indexOf('GET: /ready') >= 0)) {
        exit = true;
      }
      jsonMessage += `${jsonMessage.length > 0 ? ',' : ''}`;
      message += `${message.length > 0 ? '\n' : ''}`;
      if ((v instanceof String || typeof (v) === "string")) {
        message += `"${v}"`;
        jsonMessage += jsonStringify(v, null, method === 'json' ? 2 : undefined);

      }
      // else if((v instanceof ArrayBuffer && v.byteLength > 10) ||
      //   (v instanceof Buffer)) { message += "[...]" }
      else if (v instanceof Error) {
        message += `${v.name}`;
        if (v.code) {
          message += `(${v.code})`;
        }
        message += `: ${v.message}\n${v.stack}\n`;

        // Error's aren't parsable without custom handling
        const alt = {};
        Object.getOwnPropertyNames(v).forEach((key) => { alt[key] = this[key]; }, v);
        jsonMessage += jsonStringify(alt, null, method === 'json' ? 2 : undefined);
      } else {
        message += jsonStringify(v, null, method === 'json' ? 2 : null);
        jsonMessage += jsonStringify(v, null, method === 'json' ? 2 : null);
      }
    });

    if (method === 'debug' && exit) { return null; }

    loggerFile.log(method === 'json' ? 'info' : method, `{logEntry:[${jsonMessage}]}`); //untouched
    return loggerConsole.log(method === 'json' ? 'info' : method, message); //prettified
  } catch (err) {
    console.error(err);
    console.error(...args);
  }

  return null;
};

const safeStringify = (...args) => {
  try {
    let jsonMessage = '';
    (args || []).forEach((v) => {

      jsonMessage += `${jsonMessage.length > 0 ? ',' : ''}`;
      if ((v instanceof String || typeof (v) === "string")) {
        jsonMessage += jsonStringify(v, null, 2);

      } else if (v instanceof Error) {
        const alt = {};
        Object.getOwnPropertyNames(v).forEach((key) => {
          alt[key] = v[key];
        }, v);
        jsonMessage += jsonStringify(alt, null, 2);
      } else {
        jsonMessage += jsonStringify(v, null, 2);
      }
    });

    return jsonMessage;
  } catch (err) {
    console.error(err);
    console.error(...args);
  }

  return null;
};

//proxied to abstract logger for easy library replacement
const logger = {
  silly: (...args) => safeLog('silly', ...args),
  trace: (...args) => safeLog('debug', ...args),
  debug: (...args) => safeLog('debug', ...args),
  log: (...args) => safeLog('info', ...args),
  info: (...args) => safeLog('info', ...args),
  warn: (...args) => safeLog('warn', ...args),
  error: (...args) => safeLog('error', ...args),
  json: (...args) => safeLog('json', ...args),
  stringify: (...args) => safeStringify(...args)
};

export {
  logger
}

export default logger; //{...logger};



// module.exports.error(new Error("test"));
// try {
//   throw new Error("here");
// } catch (ex) { module.exports.error(ex); }
//
// module.exports.error("message first",new Error("test"), "additional message");
// module.exports.error(new Error("test"), "mesage last");
// module.exports.silly("test silly");
// module.exports.debug("test debug");
// module.exports.info("test info");
// module.exports.warn("test warn");
// module.exports.json({example : {deep:{obj:"v"}}});
