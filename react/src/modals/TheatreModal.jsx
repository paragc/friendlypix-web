import React from 'react';
import ReactPlayer from 'react-player';
import ModalContainer from '../providers/modal/ModalContainer';

const Theatre = ({ fullURL, isImage, isVideo }) => (
  <ModalContainer className="fp-theatre">
    {isVideo && (
      <ReactPlayer
        className="fp-fullvideo"
        url={fullURL}
        width={800}
        height="auto"
        controls
        playing
      />
    )}
    {(isImage || !isVideo) && (
      <img className="fp-fullpic" src={fullURL} alt="Full sized" />
    )}
  </ModalContainer>
);

export default Theatre;
