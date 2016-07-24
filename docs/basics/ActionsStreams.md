# Actions, Messages and Streams

## Redux way

Redux is about passing actions (IMHO - they should be named messages. They are not active, they are just data). Each action/message carries data what happened, like _"user clicked here"_, _"this data arrived"_ etc.

```javascript
const action = {
  type: 'user_added',
  data: 'A'
}
```

This is typical action in Redux and you can create actionCreator's function that will generate it and then call it like `userAdded('A')`.

To get messages "at work" we need them to `dispatch` in Redux. `dispatch` means that the message hits the place where it will be processed (reducer/s). `dispatch` is a function of the Store and therefore we somehow need it to be available when we want to `dispatch`.


## RxJS / RxR way

For our RxJS implementation let's think about slightly different concept - streams.

Imagine them as a unix pipes like `cat thisFile.txt | grep "TODO" | ...`. Or if you want more javascript-like example, they are little bit like [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function.

The left ("in") part of the stream/pipe acts as an `Observer`. It observes everything you put in. Observer means that it will get it and may send it further - to the right side.

The right side ("out") part of the stream is `Observable`. That means it sometimes emits the data (when some other Observer will ask for them).

In RxJS are not only these double sided streams like this but in this example are good for two reasons

1) we explained Observer and Observable (and when the stream is both, it is `Subject`)
2) Redux actions (or actionCreators) modeled in Rx are actually `Subject`s

So let's model our Redux counterpart of actions or actionsCreators as

```javascript
const userAdded$ = new Rx.Subject;
```

_**Note:** We will use the convention that Rx streams when assigned to variables will end with '$'. They don't have to but if you see something like `variable$`, you can guess that it is not usual object but Observable stream._

We have **no `dispatch`** in RxR. When we need to pass new value to message stream (user clicked or so), we simply call:

```javascript
userAdded$.next('A');
```

Now anything that observes the userAdded$ stream will get this message. With [`createPushMessageFunctions`](../api/createPushMessageFunctions.md) helper we can add syntactic sugar and create function `userAdded()` that will call `.next` itself so from the component you will call` userAdded('A')` the same way as you can from Redux (if you bind the `dispatch`).

When you will create your message streams with help of [`createMessageStreams`](../api/createMessageStreams.md), you get both in one object by default.


## Differences to mention

Redux action contains data. Redux action doesn't care where it will be consumed (reducer comes later...) and how it will get there (dispatch). That's why the action contains `type` property. It's kind of 'address' or 'signature'.

RxR stream on the other side defines the path of the data. Once the data are passed to `userAdded$` stream, we know where we find them (actually when we observe this stream).

RxR stream therefore doesn't need the `type` to address the data (and usually the accompanying constants). You push your message into just one stream - the right one. Like _"stream of user's click on ButtonX"_ or _"user scrolls"_ or _"data arrived from fetch"_...
