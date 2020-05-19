import React from 'react';
import { useMemoOne } from 'use-memo-one';
import firebase from 'firebase/app';
import 'firebase/storage';

import StorageContext from './StorageContext';

const StorageProvider = ({ children }) => {
  const storage = useMemoOne(() => firebase.storage(), []);
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
}

export default StorageProvider;
