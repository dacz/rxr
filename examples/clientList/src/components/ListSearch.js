import React from 'react';
import SearchContainer from './SearchContainer';
import ListContainer from './ListContainer';

import styles from './ListSearch.css';

const ListSearch = () => (
  <div className={ styles.container }>
    <SearchContainer />
    <ListContainer />
  </div>
);

export default ListSearch;
