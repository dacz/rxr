# createMessageStreams

Turns an array of names, into an object where keys are these names with added '$' on the end (good practice to identify streams) and the values are Rx.Subjects.

```javascript
const messageStreams = createMessageStreams([ listItems, userSelected ]);
export default messageStreams;

// Structure of messageStreams will be:
{
  listItems$: new Rx.Subject,
  listItems: (val) => listItems$.next(val),
  userSelected$: new Rx.Subject,
  userSelected: (val) => userSelected$.next(val)
}
```

You can import then your messageStreams wherever you need them (reducers, connected components, ...).


**Parameters**

- `names` **(Array | String)** An object whose values are `Rx.Subject`s. You may also pass a single function.
- `options` **Object**
  - `pushMessageFunctions` If you want create the `pushMessageFunctions`, too. Default is true.
  - `messageStreamsMonitor$` If present (and is Observer), all data sent to this message stream will be available to this observer. Good for monitoring/logging purposes.

**Returns**

- **Object** messageStreams Object with keys like

```javascript
{
  arrayItem$: Rx.Subject,
  arrayItem: (val) => arrayItem$.next(val),
  anotherArrayItem: ...
}
```
