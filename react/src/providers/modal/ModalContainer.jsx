import React from 'react';
import classnames from 'classnames';
import useModal from './useModal';

const ModalContainer = ({ children, className, ...props }) => {
  const { closeModal } = useModal();
  return (
    <div {...props} className={classnames('fp-modal-container', className)} onClick={closeModal}>
      <div className="fp-modal-container-inner" onClick={event => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default ModalContainer;
