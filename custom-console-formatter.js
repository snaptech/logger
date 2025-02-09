import { format } from 'winston';
import { MESSAGE } from 'triple-beam';
import jsonStringify from 'json-stringify-safe';

/*
 * function simple (info)
 * Returns a new instance of the simple format TransformStream
 * which writes a simple representation of logs.
 *
 *    const { level, message, splat, ...rest } = info;
 *
 *    ${level}: ${message}                            if rest is empty
 *    ${level}: ${message} ${JSON.stringify(rest)}    otherwise
 */
module.exports = format((info /*, opts */) => {
  const rest = {...info };
  delete rest.level;
  delete rest.message;
  delete rest.timestamp;
  delete rest.stack;

  info.stack = info.stack ? `\n${info.stack}` : info.stack;
  const padding = (info.padding && info.padding[info.level]) || '';

  let stringifiedRest = jsonStringify(rest);
  if (stringifiedRest === '{}') {
    stringifiedRest = '';
  } else {
    stringifiedRest = `\n${stringifiedRest}`;
  }

  info[MESSAGE] = `[${info.timestamp}] ${info.level}: ${padding}${info.message} ${info.stack || ''}${stringifiedRest || ''}`;
  return info;
});
