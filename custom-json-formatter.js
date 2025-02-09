import { format } from 'winston';
import { MESSAGE } from 'triple-beam';

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
const customJSONFormatter = format((info /*, opts*/) => {
  info[MESSAGE] = `{"timestamp":"${info.timestamp}", "level": "${info.level}", "message": ${info.message}}`;
  return info;
});

module.exports = {
  customJSONFormatter
}
module.default = customJSONFormatter;
