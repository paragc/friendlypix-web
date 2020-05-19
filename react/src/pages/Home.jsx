import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useAuth from '../providers/auth/useAuth';
import useDatabase from '../providers/db/useDatabase';
import Layout from '../components/Layout';
import Post from '../components/Post';

const Home = () => {
  const database = useDatabase();
  const { user: me } = useAuth();
  const { uid: userId } = me || {};
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    database.ref(`/feed/${userId}`)
      .orderByKey()
      .limitToLast(100)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(postIds => Promise.all(Object.keys(postIds || {}).map(postId => (
        database.ref(`/posts/${postId}`).once('value').then(snapshot => ({ ...snapshot.val(), postId }))
      ))))
      .then(loadedPosts => setPosts(loadedPosts.reverse()));
  }, [userId]);

  return (
    <Layout>
      <section id="page-feed" className="mdl-grid fp-content">
        <div className="fp-new-posts-button">
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-color--amber-400">
            Show new posts...
          </button>
        </div>
        <div className="fp-image-container mdl-cell mdl-cell--12-col mdl-grid">
          {posts.map(({ text, author, postId, thumb_url, full_url, mediaType, timestamp }) => (
            <Post
              key={postId}
              text={text}
              author={author}
              postId={postId}
              thumbURL={thumb_url}
              fullURL={full_url}
              mediaType={mediaType}
              timestamp={timestamp}
            />
          ))}
          {!posts.length && (
            <div className="fp-no-posts fp-help mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet
                      mdl-cell--8-col-desktop mdl-grid mdl-grid--no-spacing">
              <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                <i className="fp-info material-icons">help</i>
                <div>
                  <p>Start following people to see their posts!</p>
                  <p>
                    Use the <strong><i className="material-icons">search</i> search bar</strong> to find people you know and have
                  a look at the feed of <Link to="/recent"><i className="material-icons">trending_up</i> Recent</Link> posts to discover
                  interesting people.
                </p>
                  <p>Then <i className="material-icons">favorite</i> like and comment their posts!</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="fp-next-page-button">
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--fab">
            <i className="material-icons">expand_more</i>
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
