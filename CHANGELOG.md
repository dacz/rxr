# Changelog

## 0.2.x

* [breaking]: [`combineReducers`](https://dacz.github.io/rxr/docs/api/combineReducers.html) doesn't accept reducers as a multiple arguments (just one reducer is ok), but they have to be provided as an array.
* [breaking]: [`createMessageStreams`](https://dacz.github.io/rxr/docs/api/createMessageStreams.html) 2nd argument changed to `options`.
* [new]: you can log data within the message streams. Think about it as a logging dispatched actions in Redux. [More here](docs/api/createLoggerStream.md).

---

### You can find tagged [releases](https://github.com/dacz/rxr/releases) page.
