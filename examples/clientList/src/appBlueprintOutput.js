// what is produced by the blueprint function
const appBlueprintOutput = {
  appName:  'name of this part of an app',
  monitorS: 'Rx.Observable',
  stateS:   'Rx.Observable of state changes',
  reducerS: 'Rx.Observable of reducer functions, scoped to an app, too',
  actions:  {
    actionName1: {
      func:        'function that can be called with data that goes into the stream as next',
      streamS:     'Rx.Observable - next can be called on it to pass data to this stream',
      preReducerS: 'Rx.Observable that goes into reducer function',
      reducerS:    'RxObservable of what goes into combineReducer'
      // PLUS all the data from appBlueprint schema like:
      // reducer
      // stateSelector
      // pipe
    }
    // actionName2 and ...
  },
  functions: {
    func1: 'function',
    // PLUS the other functions that go into blueprint call setup
  }
  // PLUS all the data from appBlueprint, like initialState
};

export default appBlueprintOutput;
