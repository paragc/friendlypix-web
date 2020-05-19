import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import useAuth from '../providers/auth/useAuth';
import useDatabase from '../providers/db/useDatabase';

const User = ({ match }) => {
  const { params: { userId } } = match;
  const database = useDatabase();
  const { user: me } = useAuth();
  const [user, setUser] = useState();
  
  useEffect(() => {
    database.ref(`/people/${userId}`)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(loadedUser => setUser(loadedUser));
  }, []);

  const { profile_picture, full_name } = user || {};
  const { uid: myId } = me || {};
  const isMe = userId === myId;
  return (
    <Layout>
      <section id="page-user-info" className="mdl-grid fp-content">
        <div className="fp-user-container mdl-shadow--2dp mdl-cell mdl-cell--12-col">
          <div className="fp-user-avatar" style={{ backgroundImage: `url(${profile_picture})`}}></div>
          <div className="fp-name-follow-container mdl-cell mdl-cell--8-col">
            <div className="fp-user-username">{full_name}</div>
            <div className="fp-signed-in-only">
              {!isMe && (
                <>
                  <label className="fp-follow mdl-switch mdl-js-switch is-upgraded" htmlFor="follow" data-upgraded=",MaterialSwitch">
                    <input type="checkbox" id="follow" className="mdl-switch__input" value="true" />
                    <span className="mdl-switch__label">Follow</span>
                    <div className="mdl-switch__track"></div>
                    <div className="mdl-switch__thumb"><span className="mdl-switch__focus-helper"></span></div>
                  </label>
                  <label className="fp-block mdl-switch mdl-js-switch is-upgraded" htmlFor="block" data-upgraded=",MaterialSwitch">
                    <input type="checkbox" id="block" className="mdl-switch__input" value="true" />
                    <span className="mdl-switch__label">Block</span>
                    <div className="mdl-switch__track"></div>
                    <div className="mdl-switch__thumb"><span className="mdl-switch__focus-helper"></span></div>
                  </label>
                </>
              )}
              {isMe && (
                <label className="fp-notifications mdl-switch mdl-js-switch is-upgraded" htmlFor="notifications" data-upgraded=",MaterialSwitch">
                  <input type="checkbox" id="notifications" className="mdl-switch__input" value="true" />
                  <span className="mdl-switch__label">Enable Notifications</span>
                  <div className="mdl-switch__track"></div>
                  <div className="mdl-switch__thumb"><span className="mdl-switch__focus-helper"></span></div>
                </label>
              )}
            </div>
            <div className="fp-user-detail-container">
              <div className="fp-user-detail"><span className="fp-user-nbposts">1</span> posts</div>
              <div className="fp-user-detail"><span className="fp-user-nbfollowers">0</span> followers</div>
              <div className="fp-user-detail fp-user-nbfollowing-container"><span className="fp-user-nbfollowing">0</span> following</div>
            </div>
          </div>
        </div>
        <div className="fp-user-following mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col">
          <button className="fp-close-following  mdl-button mdl-js-button mdl-button--raised mdl-button--fab">
            <i className="material-icons">expand_less</i>
          </button>
        </div>
        <div className="fp-image-container mdl-cell mdl-cell--12-col mdl-grid">
          {/* <div className="fp-no-posts mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop mdl-grid mdl-grid--no-spacing">
            <div className="mdl-card mdl-shadow--2dp mdl-cell
                    mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--8-col-desktop">
              No posts yet.
            </div>
          </div> */}
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

export default User;
