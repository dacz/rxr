import { connectWithState } from 'rxr-react';
import Detail from './Detail';

const findClient = (id, clientsData) => clientsData.filter(client => (client._id === id))[0];

const selector = (state) => ({
  clientData: findClient(state.selectedClient, state.clients.data),
});

const DetailContainer = connectWithState(selector)(Detail);

export default DetailContainer;
