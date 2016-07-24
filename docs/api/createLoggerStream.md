# createLoggerStream

Logging is good for debugging. `createLoggerStream` created observable that gives you values you can log to console or you can monitor somehow else (I wish to have monitors like Redux... is here anybody who can help?)

Usage - usually in the main file (index.js):

```javascript
import { createState, createLoggerStream, startLogging, messageStreamsMonitor$ } from 'rxr';

//...
// we will log all state changes to console
const loggerStream$ = createLoggerStream(state$, messageStreamsMonitor$);
startLogging(loggerStream$);

// you can use the loggerStream$ for anything else.
// it's hot observable and gives you last value
//...
```

The `messageStreamsMonitor$` is simple helper (actually plain Rx.Subject). It should be passed when you create messageStreams, too, like:

```javascript
// messageStreams/index.js
import { createMessageStreams, messageStreamsMonitor$ } from 'rxr';

const actionStreams = createMessageStreams([
  'clientsDataLoading',
  'setFilter',
  'selectClient',
  'receivedClientsData',
  'fetchClients'
], { messageStreamsMonitor$ });

export default actionStreams;
```


**Parameters**

- list (not array!) of observable streams you want to monitor. First one **has to be** the state$ stream.

**Returns**

- **Observable** Observable stream that may be consumed by monitors or logger
