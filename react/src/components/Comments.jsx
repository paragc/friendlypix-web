import React, { useState, useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import Comment from './Comment';
import { useDatabase, useAuth } from '../providers';

const timestampSorter = (comment0, comment1) => Math.sign(comment0.timestamp - comment1.timestamp);

const Comments = ({ postId }) => {
  const inputRef = useRef();
  const { user } = useAuth();
  const database = useDatabase();
  const [comments, setComments] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editedCommentId, setEditedCommentId] = useState(null);

  useEffect(() => {
    database.ref(`/comments/${postId}`)
      .orderByKey()
      .limitToLast(100)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(commentMap => Promise.all(Object.keys(commentMap || {}).map(commentId => ({
        ...commentMap[commentId],
        commentId,
      }))))
      .then(loadedComments => setComments(loadedComments.sort(timestampSorter)));
  }, [postId, lastUpdateTime]);

  const hanldeAddComment = () => {
    setNewComment('');
    const commentObject = {
      text: newComment,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      author: {
        uid: user.uid,
        full_name: user.displayName || 'Anonymous',
        profile_picture: user.photoURL || null,
      },
    };
    return database.ref(`comments/${postId}`).push(commentObject)
      .then(() => setLastUpdateTime(Date.now()));
  };

  const hanldeEditComment = () => {
    setNewComment('');
    setEditedCommentId(null);
    return database.ref(`/comments/${postId}/${editedCommentId}`).update({
      text: newComment,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    }).then(() => setLastUpdateTime(Date.now()));
  };

  const handleSubmit = () => {
    if (editedCommentId) {
      hanldeEditComment();
    } else {
      hanldeAddComment();
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Delete the comment?')) {
      database.ref(`/comments/${postId}/${commentId}`).remove()
        .then(() => setLastUpdateTime(Date.now()))
    }
  };

  const handleOpenCommentEditor = (commentId, text) => {
    setEditedCommentId(commentId);
    setNewComment(text);
    inputRef.current.focus();
  };

  return (
    <>
      <div className="fp-comments">
        {comments.map(({ commentId, author, text }) => (
          <Comment
            commentId={commentId}
            author={author}
            text={text}
            onDelete={handleDeleteComment}
            onEdit={handleOpenCommentEditor}
          />
        ))}
      </div>
      <div className="fp-action" style={{ display: 'flex' }}>
        {/* <span className="fp-like">
          <div className="fp-not-liked material-icons">favorite_border</div>
          <div className="fp-liked material-icons" style="display: none;">favorite</div>
        </span> */}
        <form className="fp-add-comment" action="#" onSubmit={handleSubmit}>
          <div className="mdl-textfield mdl-js-textfield is-upgraded is-dirty">
            <input
              ref={inputRef}
              className="mdl-textfield__input"
              placeholder="Comment..."
              value={newComment}
              onChange={event => setNewComment(event.target.value)}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Comments;
