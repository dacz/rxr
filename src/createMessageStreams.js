import Rx from 'rxjs';
import createPushMessageFunctions from './createPushMessageFunctions';
// import isObservable from 'is-observable';

/**
 * Turns an array of names, into an object where keys are these names
 * with added '$' on the end (good practice to identify streams)
 * and the values are Rx.Subjects.
 *
 * @param {Array|String} names An object whose values are `Rx.Subject`s.
 * You may also pass a single function.
 *
 * @param {Object} options
 *        makePushMessageFunctions: {Boolean} If you want create the
 *        `pushMessageFunctions`, too. Default is true.
 *        messageStreamsMonitor$: {Observer|Subject}: if set, all data in this
 *        stream will be sent to the monitor with the name of the stream.
 *
 * @returns {Object} messageStreams Object with keys like {
 *   arrayItem$: Rx.Subject,
 *   arrayItem: (val) => arrayItem$.next(val),
 *   anotherArrayItem: ...
 * }
 */
const createMessageStreams = (
  names,
  options = {}
) => {
  const opts = Object.assign({ makePushMessageFunctions: true }, options);
  const namesArr = [].concat(names);

  return namesArr.reduce((acc, itemName) => {
    if (typeof itemName === 'string') {
      const streamName = `${itemName}$`;
      acc[streamName] = new Rx.Subject;
      if (opts.makePushMessageFunctions) {
        acc[itemName] = createPushMessageFunctions(acc[streamName]);
      }
      if (opts.messageStreamsMonitor$ && typeof opts.messageStreamsMonitor$.next === 'function') {
        acc[streamName] = acc[streamName].do(val => {
          opts.messageStreamsMonitor$.next({
            streamName,
            payload: val
          });
        });
      }
      // we need the name, but this method is not very good (expanding stream will loose it)
      acc[streamName].streamName = streamName;
    }
    return acc;
  }, {});
};

export default createMessageStreams;
