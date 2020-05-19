import React from 'react';
import { Link } from 'react-router-dom';

import { addSizeToGoogleProfilePic } from '../utils';

const DEFAULT_URL = '/images/silhouette.jpg';

const Avatar = ({ userId, fullName, photoURL, mode }) => {
  const normalizedPhotoURL = (photoURL && addSizeToGoogleProfilePic(photoURL)) || DEFAULT_URL;
  return (
    <Link className="fp-usernamelink mdl-button mdl-js-button" to={`/user/${userId}`} >
      <div className="fp-avatar" style={{ backgroundImage: `url(${normalizedPhotoURL})`}} />
      <div className={`fp-username mdl-color-text--${mode}`}>{fullName}</div>
    </Link>
  );
};

export default Avatar;
