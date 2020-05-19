import React, { useRef } from 'react';
import { getFileData, isImage, isVideo, getFile } from '../utils';
import useModal from '../providers/modal/useModal';


const UploaderDesktop = () => {
  const fileRef = useRef();
  const { openModal, closeModal } = useModal();

  const handleUpload = async (event) => {
    const file = getFile(event);
    if (!file) {
      return;
    }
    openModal('UploadModal', { isProcessing: true });
    const { dataURL, type } = await getFileData(event) || {};
    if (!dataURL) {
      closeModal();
      return;
    }
    openModal('UploadModal', { dataURL, type, isVideo: isVideo(type), isImage: isImage(type) });
  };

  const handleClick = () => {
    fileRef.current.value = null;
    fileRef.current.click();
  };

  return (
    <div onClick={handleClick} className="fp-mediacapture-wrapper">
      <input ref={fileRef} className="fp-mediacapture" onChange={handleUpload} type="file" accept="image/*,video/*" capture="camera" />
      <label className="fp-mediacapture-label" htmlFor="fp-mediacapture">Upload an image</label>
      <button className="fp-disabled-when-offline fp-signed-in-only mdl-button mdl-js-button mdl-button--fab mdl-cell--hide-tablet mdl-color--amber-400 mdl-shadow--4dp" id="add" onClick={handleUpload}>
        <i className="material-icons">file_upload</i>
      </button>
    </div>
  );
};

export default UploaderDesktop;
