# Messages and Streams

When something happens in our app, we need to process it. Usually this reflects to the state change.

Redux uses actions - objects passed to store with `dispatch`.

For RxR - our RxJS implementation let's think about slightly different concept - streams.

Imagine them as a unix pipes like `cat thisFile.txt | cat | grep "TODO" | wc -l`.

The left part [of `| cat |` in our example] waits that we (app) puts in it (it acts as `Observer` of events in our app - user clicks, dragging, router changes, ...). In our example it receives all lines of thisFile.txt. In our example the `cat` does nothing, just passes value further, but I used it to show the analogy with `Subject` in RxJS. `Subject` is `Observable` and `Observer`.

We can connect to this pipe another stream that gets all data. Our pipe on the right side acts as an `Observable` - we can observe (subscribe) to it any other function and process the data. Like the `grep` in our example above filters just the lines with our tasks.

This is the whole concept of RxR implementation of RxJS. We define streams and process them. We don't have to worry about when the event happens. The streams are here and know how to pass and transform our messages through our app.

Another important thing is that RxR uses the concept of reducers, combineReducers and createState. Actually pretty the same way as Redux so rewriting the Redux app to use RxR and RxJS is straightforward.

Action creators are Subjects:

```javascript
const userAddedS = new Rx.Subject;
```

_**Note:** I will use the (modified) convention that Rx streams when assigned to variables will end with 'S' (the convention is '$' but I like the S more) They don't have to but if you see something like `variableS`, you can guess that it is not usual object but Observable stream._

We don't have to use `dispatch` in RxR. When we need to pass new value to message stream (user clicked or so), we simply call:

```javascript
userAddedS.next('Ann')
```

Now anything that observes the userAddedS stream will get this message. In Redux you can bind the action creator os it will automatically dispatch to store. In RxR you have have automatically available corresponding function. In our previous example we can use:

```javascript
userAdded('Ann')
```


## Redux way

In Redux we have action creators, we define usually constants like `USER_ADDED` and then dispatch them to store.

```javascript
const USER_ADDED = 'USER_ADDED'
const = (name) => ({
  type: USER_ADDED,
  data: 'Ann'
});
```

This is typical action in Redux and you can create actionCreator's function that will generate it and then call it like `userAdded('A')`.

To put action creators "at work" we need them to `dispatch` in Redux. `dispatch` means that the message hits the place where it will be processed (in reducer/s). `dispatch` is a function of the Store and therefore we somehow need it to be available when we want to `dispatch`.


## RxJS / RxR way




## Differences to mention

Redux action contains data. Redux action doesn't care where it will be consumed (reducer comes later...) and how it will get there (dispatch). That's why the action contains `type` property. It's kind of 'address' or 'signature'.

RxR stream on the other side defines the path of the data. Once the data are passed to `userAddedS` stream, we know where we find them (actually when we observe this stream).

RxR stream therefore doesn't need the `type` to address the data (and usually the accompanying constants). You push your message into just one stream - the right one. Like _"stream of user's click on ButtonX"_ or _"user scrolls"_ or _"data arrived from fetch"_...
