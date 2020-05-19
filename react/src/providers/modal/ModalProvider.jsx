import React, { useState, useCallback } from 'react';

import ModalContext from './ModalContext';

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  const [data, setData] = useState(null);

  const openModal = useCallback((modal, data) => {
    setModal(modal);
    setData(data);
  }, []);
  const closeModal = useCallback(() => setModal(null), []);
  
  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType: modal, modalData: data }}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
