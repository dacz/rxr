const appBlueprintExample = {
  appName: 'ShowMeApp',

  monitor: true,

  initialState: {
    clients:        { data: [], ts: 0, status: undefined },
    filter:         '',
    selectedClient: '',
  },

  stateSelector: undefined,

  actions: {

    clientsDataLoading: {
      reducer:       true,
      stateSelector: [ 'clients' ]
    },

    setFilter: {
      pipe:          'debounceInput',
      reducer:       'setFilterReducerFnName',
      stateSelector: [ 'filter' ]
    },

    fetchClients: {
      pipe:    [ 'loadClientsAsync', '::clientsDataLoading.func' ],
      reducer: false
    },
  }
};

export default appBlueprintExample;
