import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Home, About, Recent, SinglePost, User, Terms, Splash, SignIn } from './pages';
import LoadingGateway from './providers/auth/LoadingGateway';
import useAuth from './providers/auth/useAuth';
import CurrentModal from './providers/modal/CurrentModal';

const Routes = () => {
  const { user } = useAuth();
  const loggedIn = !!user;
  return (
    <BrowserRouter>
      <LoadingGateway>
        <Switch>
          {!loggedIn && <Route exact path="/" component={SignIn} />}
          {loggedIn && <Route exact path="/home" component={Home} />}
          <Route exact path="/about" component={About} />
          <Route exact path="/recent" component={Recent} />
          <Route exact path="/terms" component={Terms} />
          <Route exact path="/post/:postId" component={SinglePost} />
          <Route exact path="/user/:userId" component={User} />
          {!loggedIn && <Redirect from="*" to="/" />}
          {loggedIn && <Redirect from="*" to="/home" />}
        </Switch>
      </LoadingGateway>
      <LoadingGateway reverse>
        <Splash />
      </LoadingGateway>
      <CurrentModal />
    </BrowserRouter>
  );
};

export default Routes;
