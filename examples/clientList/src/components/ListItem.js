import React, { PropTypes } from 'react';
import {
  fullname,
  AvatarImg,
} from './utils';
import styles from './ListItem.css';

const ListItem = ({ data, selectedClient, selectClient }) => {
  const handleSelectClient = () => selectClient(data._id);
  const style = selectedClient === data._id ? styles.containerSelected : styles.container;

  return (
    <div className={ style } onClick={ handleSelectClient }>
      <div className={ styles.avatar }>
        <AvatarImg clientData={ data } />
      </div>
      <div className={ styles.data }>
        <div className={ styles.fullName }>{ fullname(data) }</div>
        <div className={ styles.jobTitle }>
          { data.job.title }
        </div>
      </div>
    </div>
  );
};

ListItem.propTypes = {
  data:           PropTypes.object.isRequired,
  selectedClient: PropTypes.string,
  selectClient:   PropTypes.func.isRequired,
};

export default ListItem;
