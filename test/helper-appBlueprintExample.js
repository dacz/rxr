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
      // if there is not specified reducer, the name will be 'actionName' + 'Reducer'
      stateSelector: [ 'clients' ],
      monitor:       false // this stream will not be monitored
    },

    setFilter: {
      reducer:       'setFilterReducerFnName',
      stateSelector: [ 'filter' ]
    },

    selectClient: {
      reducer:       (val = '') => () => val,
      stateSelector: [ 'selectedClient' ]
    }

  }
};

export default appBlueprintExample;
