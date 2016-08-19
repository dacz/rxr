# createMessageStreams

Turns an array of names, into an object where keys are these names with added '$' on the end (good practice to identify streams) and the values are Rx.Subjects.

```javascript
const messageStreams = createMessageStreams([ listItems, userSelected ]);
export default messageStreams;

// Structure of messageStreams will be:
{
  listItemsS: new Rx.Subject,
  listItems: (val) => listItemsS.next(val),
  userSelectedS: new Rx.Subject,
  userSelected: (val) => userSelectedS.next(val)
}
```

You can import then your messageStreams wherever you need them (reducers, connected components, ...).


**Parameters**

- `names` **(Array | String)** An object whose values are `Rx.Subject`s. You may also pass a single function.
- `options` **Object**
  - `pushMessageFunctions` If you want create the `pushMessageFunctions`, too. Default is true.
  - `messageStreamsMonitorS` If present (and is Observer), all data sent to this message stream will be available to this observer. Good for monitoring/logging purposes.

**Returns**

- **Object** messageStreams Object with keys like

```javascript
{
  arrayItemS: Rx.Subject,
  arrayItem: (val) => arrayItemS.next(val),
  anotherArrayItem: ...
}
```
