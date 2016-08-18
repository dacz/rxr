import React, { PropTypes } from 'react';
import ListItem from './ListItem';

import styles from './List.css';

const List = ({ clients = [], selectedClient, actions }) => {
  const items = clients
    .map(item => (
      <ListItem
        key={ item._id }
        data={ item }
        selectClient={ actions.selectClient }
        selectedClient={ selectedClient }
      />)
    );

  return (
    <div className={ styles.container }>
      { items }
    </div>
  );
};

List.propTypes = {
  clients:        PropTypes.array,
  selectedClient: PropTypes.string,
  actions:        PropTypes.object,
};

export default List;
