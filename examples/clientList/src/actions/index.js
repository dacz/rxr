import { createMessageStreams, messageStreamsMonitorS } from 'rxr';

// you should make some optimization to exclude messageStreamsMonitorS
// from production build, like: (if you use webpack definePlugin)
const monitorS = process.env.NODE_ENV === 'production' ? undefined : messageStreamsMonitorS;

const actionStreams = createMessageStreams([
  'clientsDataLoading',
  'setFilter',
  'selectClient',
  'receivedClientsData',
  'fetchClients'
], { messageStreamsMonitorS: monitorS });

export default actionStreams;
