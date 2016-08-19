/**
 * Logs loggerStreamS to console
 * @param  {Observable} loggerStreamS created by createLoggerStream
 * @return {undefined} not important
 */
const logger = (loggerStreamS) =>
  loggerStreamS.subscribe(log => {
    console.log(`${log.streamName}: `, log.payload); // eslint-disable-line
  });

export default logger;
