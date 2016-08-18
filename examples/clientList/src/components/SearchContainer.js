import { connectWithState } from 'rxr-react';
import actionStreams from '../actions';
import Search from './Search';

// the selector is very similar to Redux.
// We can use it to pass the messageStream
// functions too, because we do not need dispatch.
const selector = (state) => ({
  filter:    state.filter,
  setFilter: actionStreams.setFilter,
});

const SearchContainer = connectWithState(selector)(Search);

export default SearchContainer;
