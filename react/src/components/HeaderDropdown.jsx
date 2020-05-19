
import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import useClickOutside from 'react-cool-onclickoutside';
import { useAuth } from '../providers';

const HeaderDropdown = ({ history }) => {
  const wrapperRef = useRef();
  const { auth, user } = useAuth();
  const [isVisible, setVisible] = useState(false);

  const handleSignOut = () => {
    setVisible(false);
    auth.signOut();
    history.push('/');
  };

  const handleDeleteAccount = async () => {
    setVisible(false);
    try {
      await auth.currentUser.delete();
      window.alert('Account deleted');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        window.alert('You need to have recently signed-in to delete your account.\n' +
          'Please sign-in and try again.');
        auth.signOut();
        history.push('/');
      }
    }
  };

  const handleToggle = () => setVisible(value => !value);

  useClickOutside(wrapperRef, () => setVisible(false));

  return (
    <div className="fp-menu-wrapper" ref={wrapperRef} onClick={handleToggle} >
      <button className="mdl-button mdl-js-button mdl-button--icon mdl-cell--hide-phone" id="fp-menu" data-upgraded=",MaterialButton">
        <i className="material-icons">more_vert</i>
      </button>
      <div className={classnames('mdl-menu__container is-upgraded', { 'is-visible': isVisible })}>
        <ul className="fp-menu-list mdl-menu mdl-js-menu mdl-menu--bottom-right" for="fp-menu">
          <Link to="/about">
            <li className="mdl-menu__item"><i className="material-icons">perm_contact_calendar</i> About - Help - Contact</li>
          </Link>
          <Link to="/terms">
            <li className="mdl-menu__item"><i className="material-icons">format_list_numbered</i> Terms of Services</li>
          </Link>
          {user && <li className="fp-sign-out mdl-menu__item fp-signed-in-only" onClick={handleSignOut}><i className="material-icons">exit_to_app</i> Sign out</li>}
          {user && <li className="fp-disabled-when-offline fp-delete-account mdl-menu__item fp-signed-in-only"  onClick={handleDeleteAccount}><i className="material-icons">cancel</i> Delete account</li>}
          {/* <li className="fp-update-privacy mdl-menu__item fp-signed-in-only privacy-dialog-link"><i className="material-icons">https</i> Privacy settings</li>*/}
        </ul>
      </div>
    </div>
  );
};

export default withRouter(HeaderDropdown);
