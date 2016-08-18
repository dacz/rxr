import React, { PropTypes } from 'react';
import {
  fullname,
  AvatarImg,
  EmailLink,
} from './utils';
import styles from './Detail.css';

const Empty = () => (
  <div className={ styles.empty }>
    Select awesome person from the left...
  </div>
);

const Data = ({ clientData }) => (
  <div className={ styles.dataContainer }>
    <div className={ styles.avatar }>
      <AvatarImg clientData={ clientData } />
    </div>
    <div className={ styles.data }>
      <h1>{ fullname(clientData) }</h1>
      <table className={ styles.tableData }>
        <tbody>
          <tr className={ styles.jobTitle }>
            <th>position: </th>
            <td>{ clientData.job.title }</td>
          </tr>
          <tr className={ styles.company }>
            <th>at: </th>
            <td>{ clientData.job.company }</td>
          </tr>
          <tr className={ styles.separator }>
            <td colSpan="2"><hr /></td>
          </tr>
          <tr className={ styles.email }>
            <th>email:</th>
            <td><EmailLink clientData={ clientData } className={ styles.link } /></td>
          </tr>
          <tr className={ styles.phone }>
            <th>phone:</th>
            <td>{ clientData.contact.phone }</td>
          </tr>
          <tr className={ styles.separator }>
            <td colSpan="2"><hr /></td>
          </tr>
          <tr className={ styles.address }>
            <th>address:</th>
            <td>
              <div>{ clientData.address.street }</div>
              <div>
                <span>{ clientData.address.zipCode }</span>
                &nbsp;<span>{ clientData.address.city }</span>
              </div>
              <div>{ clientData.address.country }</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

Data.propTypes = {
  clientData: PropTypes.object,
};

const Detail = ({ clientData }) => (
  <div className={ clientData ? styles.container : styles.containerEmpty }>
    { clientData ? <Data clientData={ clientData } /> : <Empty /> }
  </div>
);

Detail.propTypes = {
  clientData: PropTypes.object,
};

export default Detail;
