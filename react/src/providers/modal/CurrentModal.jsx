import React from 'react';
import * as MODALS from '../../modals';
import useModal from './useModal';

const CurrentModal = () => {
  const { modalData, modalType } = useModal();
  const ActiveModal = MODALS[modalType];

  if (!ActiveModal) {
    return null;
  }

  return <ActiveModal {...modalData} />;
};

export default CurrentModal;
