import { createMessageStreams, messageStreamsMonitor$ } from 'rxr';

// you should make some optimization to exclude messageStreamsMonitor$
// from production build, like: (if you use webpack definePlugin)
const monitor$ = process.env.NODE_ENV === 'production' ? undefined : messageStreamsMonitor$;

const actionStreams = createMessageStreams([
  'clientsDataLoading',
  'setFilter',
  'selectClient',
  'receivedClientsData',
  'fetchClients'
], { messageStreamsMonitor$: monitor$ });

export default actionStreams;
