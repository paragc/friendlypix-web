import React from 'react';

import Routes from './routes';
import { ModalProvider, DatabaseProvider, StorageProvider, AuthProvider } from './providers';

const App = () => (
  <AuthProvider>
    <DatabaseProvider>
      <StorageProvider>
        <ModalProvider>
          <Routes />
        </ModalProvider>
      </StorageProvider>
    </DatabaseProvider>
  </AuthProvider>
);

export default App;
