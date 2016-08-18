import { debounceInput } from './debounceInput';
import { loadClientsAsync } from './loadClientsAsync';
import * as reducers from './reducers';

export default {
  ...reducers,
  debounceInput,
  loadClientsAsync
};
