import {
  setupActions,
  setupReducers,
  transformStreams,
} from './helpers';
import {
  combineReducers,
  createScopedState
} from '../';
import deepmerge from 'deepmerge';


const blueprintSetup = (appInit, bp, functions) => {
  // load functions from bp
  const options = {
    appName:       bp.appName || 'app',
    stateSelector: bp.stateSelector,
    monitorS:      appInit.monitorS,
    functions
  };

  const preReducerStreams = setupActions(appInit.actions, bp.actions, options);
  const reducerStreams = setupReducers(preReducerStreams, bp.actions, options);
  const reducersArray = Object.keys(reducerStreams).map(name => reducerStreams[name]);

  // combineReducers
  const reducerS = combineReducers(reducersArray);

  // make stateS
  const stateS = createScopedState(reducerS, bp.initialState);

  return deepmerge(
    appInit,
    { actions: transformStreams('preReducerS', preReducerStreams) },
    { actions: transformStreams('reducerS', reducerStreams) },
    {
      initialState: bp.initialState,
      reducerS,
      stateS,
      functions
    }
  );
};

export default blueprintSetup;
