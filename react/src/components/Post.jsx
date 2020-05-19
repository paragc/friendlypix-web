import React, { useState, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import useClickOutside from 'react-cool-onclickoutside';


import Avatar from './Avatar';
import Comments from './Comments';
import { useDatabase, useStorage, useModal, useAuth } from '../providers';
import { isVideo, isImage, deletePost, getHumanTime } from '../utils';
import Comment from './Comment';

const Post = ({
  postId,
  thumbURL,
  fullURL,
  mediaType,
  author,
  text,
  timestamp,
  history,
  location,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef();
  const { openModal } = useModal();
  const database = useDatabase();
  const storage = useStorage();
  const { user } = useAuth();
  const { uid: authorId, profile_picture: authorAvatar, full_name: authorName } = author || {}; 
  const imageMode = isImage(mediaType);
  const videoMode = isVideo(mediaType);

  useClickOutside(wrapperRef, () => setShowDropdown(false));

  const handleShowDropdown = () => setShowDropdown(true);
  
  const handlePreview = () => openModal('TheatreModal', { fullURL, isImage: imageMode, isVideo: videoMode });

  const handleDelete = () => {
    if (window.confirm('Do you want to delete a post?')) {
      deletePost(postId, user, database, storage);
      const oldPathname = location.pathname;
      history.push('/');
      if (!oldPathname.startsWith('/post')) {
        setTimeout(() => history.push(oldPathname), 0);
      }
    }
  };

  return (
    <div className="fp-post mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--8-col-desktop mdl-grid mdl-grid--no-spacing fp-owned-post">
      <div className="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
        <div className="fp-header">
          <Avatar userId={authorId} photoURL={authorAvatar} fullName={authorName} mode="black" />
          <div className="fp-menu-wrapper" ref={wrapperRef}>
            <button onClick={handleShowDropdown} className="fp-signed-in-only mdl-button mdl-js-button mdl-button--icon" id={`fp-post-menu-${postId}`} data-upgraded=",MaterialButton">
              <i className="material-icons">more_vert</i>
            </button>
            <div className={classnames('mdl-menu__container is-upgraded', { 'is-visible': showDropdown })}>
              <ul className="fp-menu-list mdl-menu mdl-js-menu mdl-menu--bottom-right" htmlFor={`fp-post-menu-${postId}`} data-upgraded=",MaterialMenu">
                {/* <li className="mdl-menu__item fp-report-post"><i className="material-icons">report</i> Report</li> */}
                <li className="mdl-menu__item fp-delete-post" onClick={handleDelete}><i className="material-icons">delete</i> Delete post</li>
              </ul>
            </div>
          </div>
          <div className="fp-time-wrapper"><Link to={`/post/${postId}`} className="fp-time">{getHumanTime(timestamp)}</Link></div>
        </div>
        <div
          className="fp-image"
          style={{ backgroundImage: `url(${thumbURL})`, backgroundSize: videoMode ? 'cover' : 'contain' }}
          onClick={handlePreview}
        >
          {videoMode && <i className="fp-play-video material-icons">play_circle_outline</i>}
        </div>
        <div className="fp-likes" style={{ display: 'none' }}>0 likes</div>

        <div className="fp-first-comment">
          <Comment commentId={postId} author={author} text={text} />
        </div>
        {/* <div className="fp-morecomments">View more comments...</div> */}
        <Comments postId={postId} />
      </div>
    </div>
  );
};

export default withRouter(Post);
