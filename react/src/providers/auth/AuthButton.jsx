import React, { useRef, useEffect } from 'react';
import firebase from 'firebase/app';

import useAuth from './useAuth';
import AuthGateway from './AuthGateway';

const BasicAuthButton = ({ onLoad, ...props }) => {
  const { authUi } = useAuth();
  const authUiRef = useRef();

  useEffect(() => {
    authUi.start('#firebaseui-auth-container', {
      'signInFlow': (
        ('standalone' in window.navigator) && window.navigator.standalone ? 'redirect' : 'popup'
      ),
      'signInOptions': [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      ],
      'callbacks': {
        'uiShown': onLoad,
      },
    });
  }, []);

  return <div {...props} ref={authUiRef} />;
};

const AuthButton = ({ onLoad, ...props }) => (
  <AuthGateway reverse>
    <BasicAuthButton {...props} onLoad={onLoad}/>
  </AuthGateway>
);

export default AuthButton;
