import React from 'react';
import Header from './Header';
import useAuth from '../providers/auth/useAuth';

const Layout = ({ children }) => {
  const { user, auth } = useAuth();
  return (
    <div className="mdl-layout__container">
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header has-drawer is-upgraded">
        <Header user={user} auth={auth} />
        <main class="mdl-layout__content mdl-color--grey-100">{children}</main>
      </div>
    </div>
  );
};

export default Layout;