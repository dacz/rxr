# Provider.md

Provides stateS stream to your app within React context.

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
//   userSelectedS: new Rx.Subject,
//   userSelected: (val) => userSelectedS.next(val)
// }

const userreducerS = messageStreams.userSelectedS
  .map(item => (state) => ({ itemsSelected: state.itemsSelected.push(item) }));

const initialState = { itemsSelected: [] };
const stateS = createState(userreducerS, initialState);

render(
  <Provider stateS={ stateS }>
    <App />
  </Provider>, document.getElementById('index')
);
```
