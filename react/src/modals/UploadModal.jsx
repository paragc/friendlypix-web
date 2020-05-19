import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { extension } from 'mime-types';
import { v4 as uuidV4 } from 'uuid';
import firebase from 'firebase/app';

import ModalContainer from '../providers/modal/ModalContainer';
import useModal from '../providers/modal/useModal';
import useStorage from '../providers/storage/useStorage';
import useDatabase from '../providers/db/useDatabase';
import useAuth from '../providers/auth/useAuth';
import { processFileData, uploadFile } from '../utils';

const DEFAULT_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const THUMB_FORMAT = 'image/jpeg';
const THUMB_EXTENSION = 'jpg';

const Upload = ({ dataURL, isVideo, isImage, type, isProcessing, history }) => {
  const { user } = useAuth();
  const { closeModal } = useModal();
  const storage = useStorage();
  const database = useDatabase();
  const [text, setText] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleTextChange = event => setText(event.target.value);
  const handleSubmit = async () => {
    setLoading(true);
    const { full, thumb } = await processFileData({ dataURL, type }, THUMB_FORMAT);
    const name = uuidV4();
    const newPostKey = database.ref('/posts').push().key;
    const thumbFileRef = storage.ref(`${user.uid}/thumb/${newPostKey}/${name}.${THUMB_EXTENSION}`);
    const fullFileRef = storage.ref(`${user.uid}/full/${newPostKey}/${name}.${extension(type)}`);
    const [thumbUrl, fullUrl] = await Promise.all([
      uploadFile(thumbFileRef, thumb),
      uploadFile(fullFileRef, full),
    ]);
    const update = {};
    update[`/posts/${newPostKey}`] = {
      full_url: fullUrl,
      thumb_url: thumbUrl,
      text: text,
      client: 'web',
      mediaType: full.type,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      full_storage_uri: fullFileRef.toString(),
      thumb_storage_uri: thumbFileRef.toString(),
      author: {
        uid: user.uid,
        full_name: user.displayName || 'Anonymous',
        profile_picture: user.photoURL || null,
      },
    };
    update[`/people/${user.uid}/posts/${newPostKey}`] = true;
    update[`/feed/${user.uid}/${newPostKey}`] = true;
    await database.ref().update(update);
    setLoading(false);
    closeModal();
    setTimeout(() => history.push('/'), 300);
  };

  return (
    <ModalContainer id="page-add" className="fp-theatre">
      {!isProcessing && (
        <div className="fp-addcontainer mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
          {isImage && (
            <img
              id="newPictureContainer"
              src={dataURL || DEFAULT_DATA_URL}
              alt="Full sized"
            />
          )}
          {isVideo && (
            <ReactPlayer
              className="fp-fullvideo"
              url={dataURL}
              width={800}
              controls
              playing
            />
          )}
          <div className="mdl-card__supporting-text mdl-color-text--grey-600">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input
                className="mdl-textfield__input"
                type="text"
                id="mediaCaptionInput"
                value={text}
                onChange={handleTextChange}
                placeholder="Media caption..."
              />
            </div>
            <br />
            <button onClick={handleSubmit} className="fp-upload mdl-button mdl-js-button mdl-button--raised mdl-color--amber-400">
              Upload this file!
            </button>
            <div className="fp-legalese-add">
              All uploaded media will be publicly viewable, and must adhere to the&nbsp;
              <Link to="/terms">Terms of Service</Link>.
            </div>
          </div>
        </div>
      )}
      {(isLoading || isProcessing) && (
        <div className="fp-overlay">
          <i className="material-icons">hourglass_full</i>
        </div>
      )}
    </ModalContainer>
  );
};

export default withRouter(Upload);
