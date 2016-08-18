import React from 'react';

import ListSearch from './ListSearch';
import DetailContainer from './DetailContainer';
import styles from './App.css';

const App = () => (
  <div className={ styles.container }>
    <ListSearch />
    <DetailContainer />
  </div>
);

export default App;
