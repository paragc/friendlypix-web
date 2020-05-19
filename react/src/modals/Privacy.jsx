
import React from 'react';

const Privacy = () => (
  <dialog id="privacy-dialog" className="mdl-dialog">
    <h4 className="mdl-dialog__title">Let's protect privacy!</h4>
    <div className="mdl-dialog__content">
      <p> Since FriendlyPix is an instructional application, we delete all user
        data and photos and remove inactive accounts after 30
        days. Still, you should avoid posting any personal or sensitive data to
        FriendlyPix. But play along, so we can show you the kind of data privacy
        protections you can implement with Firebase! What forms of your data do
        you consent to FriendlyPix saving?</p>
      <form className="col s12">
        <p>
          <input type="checkbox" name="allow-data" id="allow-data"/>
          <label htmlFor="allow-data">
            I agree to the FriendlyPix terms of service, and consent to having
            my data processed in accordance with the privacy policy. I
            understand that my photos will be deleted after 30 days. This is
            required to have a FriendlyPix account.
          </label>
        </p>
        <p>
          <input type="checkbox" name="allow-content" id="allow-content"/>
          <label htmlFor="allow-content">
            Do you want us to save your photos? Without this enabled, you can
            view others’ photos and comments, but you won’t be able to upload
            photos.
          </label>
        </p>
        <p>
          <input type="checkbox" name="allow-social" id="allow-social"/>
          <label htmlFor="allow-social">
            Do you want us to save users you follow, comments you make, and your
            likes? Without this enabled, you can view the feed of public posts in
            read-only mode.
          </label>
        </p>
      </form>
      <button className="mdl-button mdl-js-button mdl-button--raised mdl-color--amber-400 privacy-save" disabled>Submit</button>
    </div>
  </dialog>
);

export default Privacy;
