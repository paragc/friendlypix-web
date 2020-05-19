
import React from 'react';
import { Link } from 'react-router-dom';

const Drawer = () => (
  <div className="mdl-cell--hide-desktop mdl-cell--hide-tablet mdl-layout__drawer">
    <Link to="/" className="fp-non-eu fp-signed-out-only"><button className="fp-disabled-when-offline fp-sign-in-button mdl-button mdl-js-button"><i className="material-icons">account_circle</i> Sign in</button></Link>
    <div className="fp-signed-in-user-container mdl-color--light-blue-700 fp-signed-in-only">
      <a className="fp-usernamelink">
        <div className="fp-avatar"></div>
        <div className="fp-username mdl-color-text--white"></div>
      </a>
    </div>
    <nav className="mdl-navigation">
      <Link className="mdl-navigation__link is-active fp-signed-in-only" to="/home"><i className="material-icons">home</i> Home</Link>
      <Link className="mdl-navigation__link" to="/recent"><i className="material-icons">trending_up</i> Recent</Link>
      <hr />
      <Link className="mdl-navigation__link" to="/about"><i className="material-icons">perm_contact_calendar</i> About - Help - Contact</Link>
      <hr />
      <Link className="mdl-navigation__link" to="/terms"><i className="material-icons">format_list_numbered</i> Terms of Services</Link>
      <hr className="fp-signed-in-only"/>
      <a className="fp-sign-out mdl-navigation__link fp-signed-in-only"><i className="material-icons">exit_to_app</i> Sign out</a>
      <a className="fp-disabled-when-offline fp-delete-account mdl-navigation__link fp-signed-in-only"><i className="material-icons">cancel</i> Delete account</a>
      <a className="fp-update-privacy mdl-navigation__link fp-signed-in-only privacy-dialog-link"><i className="material-icons">https</i> Privacy settings</a>
    </nav>
  </div>
);

export default Drawer;
