import isObservable from 'is-observable';

const messagesToStream = (subject) => (...args) => subject.next(...args);

/**
 * Turns an object whose values are Rx.Subjects, into an object with the
 * same keys, but their values are not Subjects but functions, that
 * may be called directly with data you want to push to Subject.
 * So instead of using `userClicks$.next('buttonX')`
 * once you do `const userClicked = createPushMessageFunctions(userClicks)` and then
 * just use `userClicked('buttonX')`.
 *
 * For convenience, you can also pass a single Subject as the first argument,
 * and get a function in return.
 *
 * @param {Observable|Object} Subject An object whose values are Rx.Subject.
 * You may also pass a single Observable.
 *
 * @returns {Function|Object} Object mimicking the original object, but with
 * values changed from Rx.Subject to ordinary functions you can call with
 * values that will be passed to the Subject as `.next()`.
 */
const createPushMessageFunctions = (subjects) => {
  if (isObservable(subjects)) return messagesToStream(subjects);

  if (typeof subjects !== 'object' || subjects === null) {
    throw new Error(
      `messagesToStreams expected an object or a function,
      instead received: ${subjects === null ? 'null' : typeof subjects}.`
    );
  }

  return Object.keys(subjects).reduce((acc, key) => {
    const subject = subjects[key];
    if (isObservable(subject)) {
      acc[key] = messagesToStream(subject);
    }
    return acc;
  }, {});
};

export default createPushMessageFunctions;
