import React, { PropTypes } from 'react';

export const fullname = (data) => `${data.general.firstName} ${data.general.lastName}`;

export const AvatarImg = ({ clientData }) => (
  <img src={ clientData.general.avatar } alt={ fullname(clientData) } />
);

AvatarImg.propTypes = {
  clientData: PropTypes.object.isRequired,
};

// this is not generic, but for our purpose it is easier (we need name, email, etc.)
export const EmailLink = ({ clientData, ...other }) => (
  <a
    href={ clientData.contact.email }
    title={ `write mail to ${fullname(clientData)}` }
    { ...other }
  >
    { clientData.contact.email }
  </a>
);

EmailLink.propTypes = {
  clientData: PropTypes.object.isRequired,
};
