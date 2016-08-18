const appBlueprint = {
  // we want to log so monitorStream will be created so messageStreams will be logged
  monitor: true,

  // here we can define initial state
  // it's a kind of documenting the state structure, too
  initialState: {
    clients:        { data: [], ts: 0, status: undefined },
    filter:         '',
    selectedClient: '',
  },

  // when composing multiple blueprints together (next version)
  // we can use state selector for this whole blueprint
  // so each blueprint manages just a part of the state
  // If manages the whole state, you have not to specify it here
  // (this is the same as specify with undefined)
  stateSelector: undefined,

  actions: {

    clientsDataLoading: {
      // default is true to try to generate reducer
      // the blueprint setup will look for corresponding function name
      // like here 'clientsDataLoadingReducer'
      reducer: true,

      // this is selector which part of the state the reducer 'maintains'.
      // if not specified, it works with the whole state
      // currently supported only one level selectors!
      stateSelector: [ 'clients' ]
    },

    setFilter: {
      // when we want to process data comming to the messageStream
      // we can pass the function here
      // the function receives Observable (initial Rx.Subject)
      // and is supopsed to return Observable.
      // here we will simply debounce user input
      pipe: 'debounceInput', // like: fname1 = blueprint.stream.setFilter$.debounceTime(100);
      // // If the function requires additional arguments, they are passed as an array like
      // pipe: [ 'fnName1', 'arg1', 'arg2' ]

      reducer:       'setFilterReducer', // we may specify the name of reducer function
      stateSelector: [ 'filter' ]
    },

    selectClient: {
      // you may specify reducer function
      reducer:       true,
      stateSelector: [ 'selectedClient' ]
    },

    receivedClientsData: {
      reducer:       true,
      stateSelector: [ 'clients' ]
    },

    fetchClients: {
      // our function needs to interact with other actions
      // we reference them as a parameters to the functon call
      pipe: [ 'loadClientsAsync', 'clientsDataLoading.func', 'receivedClientsData.func' ],

      // we may create stream that will not have it's own reducer.
      // in this case the fetch will call clientsDataLoading stream
      // and after the data are received it will call receivedClientsData
      // there is no other output -> no need to push to reducer and
      // no further modifying the state
      reducer: false
    },
  }
};

export default appBlueprint;
