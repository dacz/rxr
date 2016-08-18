# Changelog


## 0.3.x - introduces new concepts of blueprint and changes API a lot

If you want to see and use previous version, look for the 0.2.x release.

If you are using 0.2.x or 0.1.x, then DO NOT UPDATE until you will go through new documentation and modify your code. Sorry for inconvenience but you will be surprised that it's worth of doing this. Your code will be way more readable, you get scoped reducers and be thrilled by blueprint concept (at least I'm).

* introduces blueprint as a new way how to construct the app


## 0.2.x

* [breaking]: [`combineReducers`](https://dacz.github.io/rxr/docs/api/combineReducers.html) doesn't accept reducers as a multiple arguments (just one reducer is ok), but they have to be provided as an array.
* [breaking]: [`createMessageStreams`](https://dacz.github.io/rxr/docs/api/createMessageStreams.html) 2nd argument changed to `options`.
* [new]: you can log data within the message streams. Think about it as a logging dispatched actions in Redux. [More here](docs/api/createLoggerStream.md).

---

### You can find tagged [releases](https://github.com/dacz/rxr/releases) page.
