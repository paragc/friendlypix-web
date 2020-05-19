import { useContext } from 'react';

import StorageContext from './StorageContext';

const useStorage = () => useContext(StorageContext);

export default useStorage;
