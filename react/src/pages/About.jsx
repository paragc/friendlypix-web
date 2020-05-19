import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const About = () => (
  <Layout>
    <section id="page-about" className="mdl-grid fp-content">
      <div className="fp-help mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--8-col-desktop">
        <div className="mdl-card__supporting-text mdl-color-text--grey-600">
          <i className="fp-info material-icons">info</i>
          <div>
            <p>FriendlyPix is a  photo sharing app showcasing the use of the <a href="https://firebase.google.com">Firebase Platform</a>.</p>
            <p>This application is meant as a sample application for developers, avoid posting private or personal data.</p>
          </div>
        </div>
      </div>
      <div className="fp-help mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--8-col-desktop">
        <div className="mdl-card__supporting-text mdl-color-text--grey-600">
          <i className="fp-info material-icons">help</i>
          <div>
            <p>Start following people to see their posts in your <Link to="/"><i className="material-icons">home</i>home</Link>!</p>
            <p>
              Use the <strong><i className="material-icons">search</i>search bar</strong> to find people you know and have
              a look at the feed of <Link to="/recent"><i className="material-icons">trending_up</i>Recent</Link> posts to discover
              interesting people.
            </p>
            <p>Then <i className="material-icons">favorite</i>like and comment their posts!</p>
            <p>
              Share your pics with your friends using the <i className="material-icons">file_upload</i>or <i className="material-icons">photo_camera</i>buttons.
            </p>
          </div>
        </div>
      </div>
      <div className="fp-help mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--8-col-desktop">
        <div className="mdl-card__supporting-text mdl-color-text--grey-600">
          <i className="fp-info material-icons">contacts</i>
          <div>
            <p>To contact the team, send an email to <code>friendlypix-team@google.com</code>.</p>
            <p>For other requests and questions you can file an issue on the <a href="https://github.com/firebase/friendlypix-web"><code>firebase/friendlypix-web</code></a> GitHub repo.</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
