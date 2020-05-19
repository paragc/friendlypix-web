import React, { useState, useEffect } from 'react';
import { useMemoOne } from 'use-memo-one'
import firebase from 'firebase/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui';

import AuthContext from './AuthContext';

const checkAdmin = async (auth) => {
  try {
    const idToken = await auth.currentUser.getIdToken();
    const tokenData = JSON.parse(window.atob(idToken.split('.')[1]));
    return !!tokenData.admin;
  } catch (e) {
    return false;
  }
}

const AuthProvider = ({ children }) => {
  const auth = useMemoOne(() => firebase.auth(), []);
  const authUi = useMemoOne(() => firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth), []);

  const [user, setUser] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const handleAuthChange = async (user) => {
      setLoaded(true);
      setUser(user);
      setAdmin(await checkAdmin(auth));
    }
    auth.onAuthStateChanged(handleAuthChange);
  }, []);

  return (
    <AuthContext.Provider value={{ authUi, auth, user, isLoaded, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
