import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import useAuth from '../providers/auth/useAuth';
import useDatabase from '../providers/db/useDatabase';

const SinglePost = ({ match }) => {
  const { params: { postId } } = match;
  const database = useDatabase();
  const { user: me } = useAuth();
  const [post, setPost] = useState();
  
  useEffect(() => {
    database.ref(`/posts/${postId}`)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(loadedPost => setPost(loadedPost));
  }, []);

  const { author, text, thumb_url, full_url, mediaType, timestamp } = post || {};
  const { uid: myId } = me || {};
  const { uid: authorId } = author || {};
  const isMyPost = authorId === myId;

  return (
    <Layout>
      <section id="page-post" className="mdl-grid fp-content">
        <div className="fp-image-container mdl-cell mdl-cell--12-col mdl-grid">
          <Post
            text={text}
            author={author}
            postId={postId}
            thumbURL={thumb_url}
            fullURL={full_url}
            mediaType={mediaType}
            timestamp={timestamp}
          />
        </div>
      </section>
    </Layout>
  );
};

export default SinglePost;
