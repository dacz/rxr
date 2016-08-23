const appBlueprintExampleOutput = {
  appName: 'ShowMeApp',

  monitor:  true,
  monitorS: '<Observable>',

  initialState: {
    clients:        { data: [], ts: 0, status: undefined },
    filter:         '',
    selectedClient: ''
  },
  stateS: '<Observable>',

  stateSelector: undefined,

  reducerS: '<Observable>',

  actions: {

    clientsDataLoading: {
      stateSelector: [ 'clients' ],
      func:          '<Function>',
      streamS:       '<Observable>',
      reducerS:      '<Observable>'
    },

    setFilter: {
      reducer:       'setFilterReducerFnName',
      stateSelector: [ 'filter' ],
      func:          '<Function>',
      streamS:       '<Observable>',
      reducerS:      '<Observable>'
    },

    selectClient: {
      reducer:       '<Function>',
      stateSelector: [ 'selectedClient' ],
      func:          '<Function>',
      streamS:       '<Observable>',
      reducerS:      '<Observable>'
    }

  },

  functions: {
    clientsDataLoadingReducer: '<Function>',
    setFilterReducerFnName:    '<Function>',
  }

};

export default appBlueprintExampleOutput;
