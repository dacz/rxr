import Rx from 'rxjs';
import createPushMessageFunctions from './createPushMessageFunctions';

/**
 * Turns an array of names, into an object where keys are these names
 * with added '$' on the end (good practice to identofy streams)
 * and the values are Rx.Subjects.
 *
 * IDEA: When you want to create nested structures, just pass object as an
 * array item.
 *
 * @param {Array|String} names An object whose values are `Rx.Subject`s.
 * You may also pass a single function.
 *
 * @param {Boolean} makePushFunctions If you want create the
 * `pushMessageFunctions`, too. Default is true.
 *
 * @returns {Object} makePushFunctions If you want create the
 * `pushMessageFunctions`, too. Default is true.
 */
const createMessageStreams = (names, makePushMessageFunctions = true) => {
  const namesArr = [].concat(names);
  return namesArr.reduce((acc, itemName) => {
    if (typeof itemName === 'string') {
      const streamName = `${itemName}$`;
      acc[streamName] = new Rx.Subject;
      if (makePushMessageFunctions) acc[itemName] = createPushMessageFunctions(acc[streamName]);
    }
    return acc;
  }, {});
};

// IDEA: possible to submit structure, not jut flat array

export default createMessageStreams;
