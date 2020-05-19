import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useClickOutside from 'react-cool-onclickoutside';
import classnames from 'classnames';

const Comment = ({ commentId, author, text, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef();
  const { uid: authorId, full_name: fullName } = author || {};

  useClickOutside(wrapperRef, () => setShowDropdown(false));

  const handleShowDropdown = () => setShowDropdown(true);

  const handleEdit = () => {
    setShowDropdown(false);
    onEdit(commentId, text);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    onDelete(commentId);
  };

  return (
    <div id={`comment-${commentId}`} className="fp-comment fp-comment-owned">
      <Link className="fp-author" to={`/user/${authorId}`}>{fullName}</Link>:
      <span className="fp-text">{text}</span>
      <div className="fp-menu-outer-wrapper">
        <div className="fp-menu-wrapper" ref={wrapperRef}>
          <button onClick={handleShowDropdown}className="fp-edit-delete-comment-container fp-signed-in-only mdl-button mdl-js-button mdl-button--icon" id="fp-comment-menu--M780QiEe0Hkjyjs3CSA" data-upgraded=",MaterialButton">
            <i className="material-icons">more_vert</i>
          </button>
          <div className={classnames('mdl-menu__container is-upgraded', { 'is-visible': showDropdown })}>
            <ul className="fp-menu-list mdl-menu mdl-js-menu mdl-menu--bottom-right" htmlFor="fp-comment-menu--M780QiEe0Hkjyjs3CSA" data-upgraded=",MaterialMenu">
              {/* <li className="mdl-menu__item fp-report-comment" tabIndex="-1"><i className="material-icons">report</i> Report</li> */}
              <li className="mdl-menu__item fp-edit-comment" onClick={handleEdit}><i className="material-icons">mode_edit</i> Edit</li>
              <li className="mdl-menu__item fp-delete-comment" onClick={handleDelete}><i className="material-icons">delete</i> Delete comment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
