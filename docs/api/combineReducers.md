# combineReducers

combine multiple reducers (observable streams of functions)
into one stream that can be pushed to `createState`.

```javascript
const combinedreducerS = combineReducer([
  selectedItemsS,
  listItemsS
])
```

**Parameters**

- `reducers` **(Array of observables or one observable)** one reducer or array of reducers streams (Observables).

**Returns**

- **Observable** Observable that produces functions how to modify state.
