import React from 'react';
import { Link } from 'react-router-dom';

import AuthButton from '../providers/auth/AuthButton';

const SignIn = () => (
  <section id="page-splash">
    <h3 className="fp-logo"><img src="/images/icon-128x128.png" alt="Friendly Pix Logo"/> Friendly Pix</h3>
    <div className="fp-caption">The friendliest way to share your pics</div>
    <div className="fp-signed-out-only fp-initially-hidden">
      <AuthButton id="firebaseui-auth-container" className="fp-non-eu fp-signed-out-only fp-initially-hidden" />
      <Link className="fp-non-eu fp-skip" to="/recent">skip sign in</Link>
    </div>
    <div className="fp-non-eu fp-note fp-signed-out-only fp-initially-hidden">
      <label className="mdl-checkbox mdl-js-checkbox" htmlFor="fp-pre-consent">
        <input type="checkbox" id="fp-pre-consent" className="mdl-checkbox__input"/>
        <span className="mdl-checkbox__label">I understand <a href="https://github.com/firebase/friendlypix-web">FriendlyPix</a> is an application aimed at showcasing the <a href="https://firebase.google.com/docs">Firebase</a> platform capabilities, and should not be used with private or sensitive information. All FriendlyPix data and inactive accounts are regularly removed. I agree to the <Link to="/terms">Terms of Service</Link> and <a href="https://www.google.com/policies/privacy/">Privacy Policy</a>.</span>
      </label>
    </div>
    {/* <Link className="fp-eu fp-initially-hidden" to="/recent">
      <button className="fp-view-posts-button mdl-button mdl-js-button mdl-button--raised mdl-color--green-800 mdl-color-text--white">
        View posts
      </button>
    </Link>
    <div className="fp-eu fp-note fp-signed-out-only fp-initially-hidden">
      <a href="https://github.com/firebase/friendlypix-web">FriendlyPix</a> is an application aimed at showcasing the <a href="https://firebase.google.com/docs">Firebase</a> platform capabilities, and should not be used with private or sensitive information. All FriendlyPix data and inactive accounts are regularly removed. By continuing, you agree to the <Link to="/terms">Terms of Service</Link> and <a href="https://www.google.com/policies/privacy/">Privacy Policy</a>.
    </div>
    <div className="fp-eu fp-note fp-signed-out-only fp-initially-hidden">
      Unfortunately, this hosted version of the FriendlyPix sample app is not fully available in your location (based on your IP address). You can view a limited version of the sample app, or to experience all the features, deploy your own instance. Instructions can be found on the <a href="https://github.com/firebase/friendlypix-web">GitHub repository</a>.
    </div> */}
  </section>
);

export default SignIn;
