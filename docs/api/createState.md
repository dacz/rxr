# createState

creates observable application state (stream). You can subscribe to this stream and get the current state object and new object every time the state changes.

You usually use this in a separate file and then import it wherever you need it.

```javascript
import combinedReducer$ from './appReducer';
const state$ = createState(combinedReducer$, initialState$);
export default state$;
```




**Parameters**

- `reducer$` **Observable** Stream of reducer functions
- `initialState` **(Observable | Object), (default Rx.Observable.of({}))**  
  Initial state may be Observable or object (will be converted to Observable)

**Returns**

- **Observable** Observable stream of current state
