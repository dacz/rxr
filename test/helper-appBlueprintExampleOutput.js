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
      reducer:       true,
      stateSelector: [ 'clients' ],
      func:          '<Function>',
      streamS:       '<Observable>',
      preReducerS:   '<Observable>',
      reducerS:      '<Observable>'
    },

    setFilter: {
      pipe:          'debounceInput',
      reducer:       'setFilterReducerFnName',
      stateSelector: [ 'filter' ],
      func:          '<Function>',
      streamS:       '<Observable>',
      preReducerS:   '<Observable>',
      reducerS:      '<Observable>'
    },

    fetchClients: {
      pipe:        [ 'loadClientsAsync', ':clientsDataLoading.func' ],
      reducer:     false,
      func:        '<Function>',
      streamS:     '<Observable>',
      preReducerS: '<Observable>',
    }
  },

  functions: {
    clientsDataLoadingReducer: '<Function>',
    debounceInput:             '<Function>',
    setFilterReducerFnName:    '<Function>',
    loadClientsAsync:          '<Function>'
  }

};

export default appBlueprintExampleOutput;
