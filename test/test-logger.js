import test from 'ava';
import sinon from 'sinon';
import Rx from 'rxjs';
import logger from '../src/logger';

test('logger', t => {
  const dataLog = [
    { streamName: 'someStream', payload: 'some payload' },
    { streamName: 'someOtherStream', payload: 'some other payload' },
    { streamName: 'someStream3', payload: 'payload3' }
  ];
  const dataWant = [
    [ 'someStream: ', 'some payload' ],
    [ 'someOtherStream: ', 'some other payload' ],
    [ 'someStream3: ', 'payload3' ]
  ];

  const streamToMonitorS = new Rx.Subject;
  sinon.spy(console, 'log');
  logger(streamToMonitorS);
  t.plan(3);
  dataLog.forEach((val, index) => {
    streamToMonitorS.next(val);
    t.true(console.log.calledWith(...dataWant[index])); // eslint-disable-line
  });
  console.log.restore(); // eslint-disable-line
});
