import isObservable from 'is-observable';

/**
 * allows to log any Observable to monitor stream
 * @param  {String} streamName Name that will be show in the log
 * @param  {Observable} obsS   Stream that will be monitored
 * @param  {Observer} monitorS Observer - usually monitorS of an app
 * @return {Observable}        Returns obsS so it can be chained
 */
const wrapByMonitor = (streamName, obsS, monitorS) => {
  if (!isObservable(obsS)) {
    throw new Error(`wrapByMonitor can monitor only observable.
      Got: ${obsS}`);
  }
  if (typeof monitorS.next !== 'function') {
    throw new Error(`wrapByMonitor needs monitorS argument to be observer.
      Got: ${monitorS}`);
  }
  return obsS.do((val) => monitorS.next({ streamName, payload: val }));
};

export default wrapByMonitor;
