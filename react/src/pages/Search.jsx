import React from 'react';
import Layout from '../components/Layout';

const Search = () => (
  <Layout>
    <section id="page-search" className="mdl-grid fp-content">
      <div className="fp-user-container mdl-shadow--2dp mdl-cell mdl-cell--12-col">
        <div className="fp-name-follow-container mdl-cell mdl-cell--8-col">
          <div className="fp-hashtag"></div>
        </div>
      </div>
      <div className="fp-image-container mdl-cell mdl-cell--12-col mdl-grid">
        <div className="fp-no-posts mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop mdl-grid mdl-grid--no-spacing">
          <div className="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--8-col-desktop">
            No posts found.
          </div>
        </div>
      </div>
      <div className="fp-next-page-button">
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--fab">
          <i className="material-icons">expand_more</i>
        </button>
      </div>
    </section>
  </Layout>
);

export default Search;
