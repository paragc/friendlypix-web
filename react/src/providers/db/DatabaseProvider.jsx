import React from 'react';
import { useMemoOne } from 'use-memo-one';
import firebase from 'firebase/app';
import 'firebase/database';

import DatabaseContext from './DatabaseContext';

const DatabaseProvider = ({ children }) => {
  const database = useMemoOne(() => firebase.database(), []);
  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
}

export default DatabaseProvider;
