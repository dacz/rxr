import React, { PropTypes, Component } from 'react';
import { connectWithState } from 'rxr-react';
import actionStreams from '../actions';
import { findInObj } from '../utils';
import { IS_LOADING } from '../utils/constants';
import List from './List';
import styles from './ListContainer.css';

const Message = ({ message }) => (
  <div className={ styles.message }>{ message }</div>
);

Message.propTypes = {
  message: PropTypes.string,
};

class ListComponent extends Component {
  static propTypes = {
    fetchClients:   PropTypes.func,
    selectClient:   PropTypes.func,
    clients:        PropTypes.object,
    selectedClient: PropTypes.string,
    filter:         PropTypes.string,
  }

  // instead of loading data in the main app,
  // it's better to load it here, because this is the component,
  // that uses them. Again, better to use this app inside bigger one.
  componentWillMount() {
    this.props.fetchClients();
    this.listToDisplay = this.filterList(
      this.props.clients.data,
      this.props.filter,
      this.props.selectedClient
    );
  }

  componentWillReceiveProps(nextProps) {
    this.listToDisplay = this.filterList(
      nextProps.clients.data,
      nextProps.filter,
      nextProps.selectedClient
    );
  }

  listToDisplay;

  isItLoading() {
    return this.props.clients.status === IS_LOADING;
  }

  isItError() {
    return !!this.props.clients.status;
  }

  filterList(clientsData, filter, selectedClient) {
    if (!filter) return clientsData;
    const filteredList = clientsData.filter(i => findInObj(i, filter));
    if (
      selectedClient
      && filteredList.filter(i => i._id === selectedClient).length < 1
    ) this.props.selectClient('');
    return filteredList;
  }

  render() {
    if (this.isItLoading()) {
      return <Message message="loading data" />;
    }
    if (this.isItError()) {
      return <Message message={ `Error loading data: ${this.props.clients.status}` } />;
    }
    if (this.listToDisplay.length === 0) {
      return <Message message="Nobody matches your search" />;
    }

    return (
      <List
        clients={ this.listToDisplay }
        selectedClient={ this.props.selectedClient }
        actions={ {
          selectClient: this.props.selectClient,
        } }
      />
    );
  }
}

const selector = (state) => ({
  clients:        state.clients,
  selectedClient: state.selectedClient,
  filter:         state.filter,
  fetchClients:   actionStreams.fetchClients,
  selectClient:   actionStreams.selectClient,
});

const ListContainer = connectWithState(selector)(ListComponent);

export default ListContainer;
