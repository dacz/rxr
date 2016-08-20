const functions = {
  clientsDataLoadingReducer: (state) => ({ ...state, status: 'LOADING' }),
  debounceInput:             (obs) => obs.debounceTime(100),
  setFilterReducerFnName:    (val = '') => () => val,
  loadClientsAsync:          (obs, par) => par('DATA')
};

export default functions;
