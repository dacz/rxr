import Rx from 'rxjs';
import initActions from './helpers';

const blueprintInit = (bp) => {
  const appInit = { appName: bp.appName || 'app' };

  const { actions, monitor } = bp;

  // create monitor
  appInit.monitorS = monitor ? new Rx.Subject : undefined;

  // create streams
  appInit.actions = initActions(actions);

  return appInit;
};

export default blueprintInit;
