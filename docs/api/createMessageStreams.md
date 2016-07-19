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
- `makePushFunctions` **Boolean** If you want create the `pushMessageFunctions`, too. Default is true.

**Returns**

- **Object** messageStreams Object with keys like

```javascript
{
  arrayItem$: Rx.Subject,
  arrayItem: (val) => arrayItem$.next(val),
  anotherArrayItem: ...
}
```
