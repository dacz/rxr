import isObservable from 'is-observable';

const createPushToStreamFunction = (obsS) => {
  if (!isObservable(obsS)) {
    throw new Error('createPushToStream: argument has to be a stream (Observable)');
  }
  return (...args) => obsS.next(...args);
};

export default createPushToStreamFunction;
