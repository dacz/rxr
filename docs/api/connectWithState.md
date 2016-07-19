# connectWithState.md

Wrap your component into connectWithState to pass the props and action/message functions it needs. On every update of the state the component will update, too (if the props change).

Similar to React-Redux connect.

This is how HoC (higher order component) looks like with RxR-React:

```javascript
import { connectWithState } from 'rxr-react';
import MyContainer from './MyContainer';
// let suppose that our userSelected$ stream is already bound with .next()
// and inside the object myMessageStreams
import messageStreams from './messageStreams';

const selector = (state) => ({
  itemsSelected: state.itemsSelected,
  userSelected: myMessageStreams.userSelected,
});

const MyHoCContainer = connectWithState(selector)(MyContainer);
```

`MyContainer` will receive `itemsSelected` (array) and `userSelected` (func) props.
