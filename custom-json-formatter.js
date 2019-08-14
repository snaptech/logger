const { format } = require('winston');
const { MESSAGE } = require('triple-beam');


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
module.exports = format((info,opts) => {
  info[MESSAGE] = `{"timestamp":"${info.timestamp}", "level": "${info.level}", "message": ${info.message}}`;
  return info;
});
