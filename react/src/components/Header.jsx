import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import UploaderDesktop from './UploaderDesktop';
import UploaderMobile from './UploaderMobile';
import HeaderDropdown from './HeaderDropdown';


const Header = ({ user, auth }) => {
  return (
    <header className="fp-header mdl-layout__header mdl-color-text--white mdl-color--light-blue-800">
      <div className="mdl-layout__header-row fp-titlebar">
        <h3 className="fp-logo"><Link to="/recent"><img src="/images/icon-128x128.png" alt="Friendly Pix Logo"/> Friendly Pix</Link></h3>
        <div className="mdl-layout-spacer"></div>
        {/* <div className="fp-searchcontainer mdl-textfield mdl-js-textfield mdl-textfield--expandable">
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="searchQuery">
            <i className="material-icons">search</i>
          </label>
          <div className="mdl-textfield__expandable-holder">
            <input className="mdl-textfield__input" type="text" id="searchQuery" />
          </div>
          <div id="fp-searchResults" className="mdl-card mdl-shadow--2dp"></div>
        </div> */}
        <div className="mdl-cell--hide-phone">
          {!user && (
            <Link className="fp-non-eu" to="/">
              <button className="fp-disabled-when-offline fp-sign-in-button fp-signed-out-only mdl-button mdl-js-button">
                <i className="material-icons">account_circle</i> Sign in
              </button>
            </Link>
          )}
          {user && (
            <div className="fp-signed-in-user-container mdl-cell--hide-phone fp-signed-in-only">
              <Avatar userId={user.uid} photoURL={user.photoURL} fullName={user.displayName} mode="white" />
            </div>
          )}
        </div>
        <HeaderDropdown />
      </div>
      <div className="fp-tab mdl-layout__header-row mdl-cell--hide-phone mdl-color--light-blue-700">
        <div className="mdl-tab">
          <Link to="/home" id="fp-menu-home" className="mdl-layout__tab fp-signed-in-only is-active mdl-button mdl-js-button"><i className="material-icons">home</i> Home</Link>
          <Link to="/recent" id="fp-menu-feed" className="mdl-layout__tab mdl-button mdl-js-button"><i className="material-icons">trending_up</i> Recent</Link>
          <UploaderDesktop />
        </div>
      </div>
      <UploaderMobile />
    </header>
  );
};

export default Header;
