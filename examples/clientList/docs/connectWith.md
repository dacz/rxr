# Connect with state and HoC (higher order components)

We choose one of higher order component (`SearchContainer.js`).

## Redux way

```javascript
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setFilter } from '../actions';
import Search from './Search';

// pretty standard mapping state to props...
const mapStateToProps = (state) => ({
  filter: state.filter,
});

// ... and dispatch to props
// (with help of Redux bindActionCreators), so we don't have
// bother our wrapped component with dispatching
const mapDispatechToProps = (dispatch) => (
  bindActionCreators({ setFilter }, dispatch)
);

const SearchContainer = connect(
  mapStateToProps,
  mapDispatechToProps
)(Search);

export default SearchContainer;
```

## RxR way

```javascript
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
```

This is virtually the same! That's great.

In RxR it is slightly simpler because we do not need `dispatch`.

Refactoring our HoC to RxR would be really easy. Hoooray!

---

That's pretty much all. 

But wait, let's say a word [about async ... &raquo;](./asyncFetch.md)
