# Provider.md

Provides state$ stream to your app within React context.

Very similar to Redux provider.

Example:

```javascript
import React from 'react';
import { render } from 'react-dom';
import Rx from 'rxjs';
import { createState, createMessageStreams } from 'rxr';
import { Provider } from 'rxr-react';

const messageStreams = createMessageStreams('userSelected');
//                     ^^^ this basically creates:
// messageStreams = {
//   userSelected$: new Rx.Subject,
//   userSelected: (val) => userSelected$.next(val)
// }

const userReducer$ = messageStreams.userSelected$
  .map(item => (state) => ({ itemsSelected: state.itemsSelected.push(item) }));

const initialState = { itemsSelected: [] };
const state$ = createState(userReducer$, initialState);

render(
  <Provider state$={ state$ }>
    <App />
  </Provider>, document.getElementById('index')
);
```
