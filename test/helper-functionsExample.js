const functions = {
  clientsDataLoadingReducer: () => (state) => ({ ...state, status: 'LOADING' }),
  setFilterReducerFnName:    (val = '') => () => val
};

export default functions;
