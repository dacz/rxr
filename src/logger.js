/**
 * Logs loggerStream$ to console
 * @param  {Observable} loggerStream$ created by createLoggerStream
 * @return {undefined} not important
 */
const logger = (loggerStream$) =>
  loggerStream$.subscribe(log => {
    console.log(`${log.streamName}: `, log.payload); // eslint-disable-line
  });

export default logger;
