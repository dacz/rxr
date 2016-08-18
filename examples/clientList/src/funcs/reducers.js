import {
  IS_LOADING
} from '../utils/constants';

// these reducer functions are scoped -> they maintain only their own part of the state

export const clientsDataLoadingReducer = (ts) =>
  state => ({ ...state, status: IS_LOADING, ts });

export const setFilterReducer = (val = '') => () => val;

export const selectClientReducer = (id = '') => () => id.toString();

export const receivedClientsDataReducer = ({ data, error, ts }) => state => {
  if (error) {
    const err = typeof error === 'object' ? error.message : error;
    return { ...state, status: err, ts };
  }
  if (Array.isArray(data)) {
    return { ...state, data, status: undefined, ts };
  }
  return state;
};
