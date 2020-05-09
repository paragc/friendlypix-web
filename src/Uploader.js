/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import $ from 'jquery';
import videojs from 'video.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import page from 'page';
import {MaterialUtils} from './Utils';

/**
 * Handles uploads of new pics.
 */
export default class Uploader {
  /**
   * @return {number}
   */
  static get FULL_IMAGE_SPECS() {
    return {
      maxDimension: 1280,
      quality: 0.9,
    };
  }

  /**
   * @return {number}
   */
  static get THUMB_IMAGE_SPECS() {
    return {
      maxDimension: 640,
      quality: 0.7,
    };
  }

  /**
   * Inititializes the pics uploader/post creator.
   * @constructor
   */
  constructor(firebaseHelper) {
    this.firebaseHelper = firebaseHelper;

    // Firebase SDK
    this.auth = firebase.auth();

    Uploader.addPolyfills();

    // DOM Elements
    this.addButton = $('#add');
    this.addButtonFloating = $('#add-floating');
    this.mediaInput = $('#fp-mediacapture');
    this.overlay = $('.fp-overlay', '#page-add');
    this.newPictureContainer = $('#newPictureContainer');
    this.newVideoContainer = $('#newVideoContainer');
    this.uploadButton = $('.fp-upload');
    this.mediaCaptionInput = $('#mediaCaptionInput');
    this.uploadMediaForm = $('#uploadMediaForm');
    this.toast = $('.mdl-js-snackbar');

    // Event bindings
    this.addButton.click(() => this.initiatePictureCapture());
    this.addButtonFloating.click(() => this.initiatePictureCapture());
    this.mediaInput.change((e) => this.readMedia(e));
    this.uploadMediaForm.submit((e) => this.uploadMedia(e));
    this.mediaCaptionInput.keyup(() => this.uploadButton.prop('disabled', !this.mediaCaptionInput.val()));

    this.newVideoPlayer = videojs(this.newVideoContainer.get(0), {
      width: '600px',
      height: 'auto',
      controls: true,
    }, () => {
      this.newVideoContainer = $('#newVideoContainer');
    });
  }

  static createVideo(src, options = {}) {
    const {append = false, initialTime = 0} = options;
    const video = document.createElement('video');
    if (src != '') {
      video.src = src;
    }
    if (append == true) {
      document.body.appendChild(video);
    }
    return new Promise((resolve, reject) => {
      video.addEventListener('loadeddata', () => {
        if (initialTime === 0) {
          resolve(video);
        } else {
          video.currentTime = video.duration * initialTime;
        }
      }, false);
      video.addEventListener('seeked', function() {
        if (initialTime > 0) {
          resolve(video);
        }
      }, false);
      video.addEventListener('error', (err) => reject(err), false);
    });
  }

  // Adds polyfills required for the Uploader.
  static addPolyfills() {
    // Polyfill for canvas.toBlob().
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: (callback, type, quality) => {
          const binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          const len = binStr.length;
          const arr = new Uint8Array(len);

          for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], {type: type || 'image/png'}));
        },
      });
    }
  }

  /**
   * Start taking a picture.
   */
  initiatePictureCapture() {
    this.mediaInput.trigger('click');
  }

  /**
   * Displays the given pic in the New Media Upload dialog.
   */
  displayPicture(url) {
    this.newPictureContainer.attr('src', url);
    page('/add');
    this.mediaCaptionInput.focus();
    this.uploadButton.prop('disabled', true);
  }

  /**
   * Displays the given video in the New Media Upload dialog.
   */
  displayVideo(url) {
    this.newVideoPlayer.src({src: url, type: 'video/mp4'});
    page('/add');
    this.mediaCaptionInput.focus();
    this.uploadButton.prop('disabled', true);
  }

  /**
   * Enables or disables the UI. Typically while the image is uploading.
   */
  disableUploadUi(disabled) {
    this.uploadButton.prop('disabled', disabled);
    this.addButton.prop('disabled', disabled);
    this.addButtonFloating.prop('disabled', disabled);
    this.mediaCaptionInput.prop('disabled', disabled);
    this.overlay.toggle(disabled);
  }

  /**
   * Reads the media the has been selected by the file picker.
   */
  readMedia(event) {
    this.clear();

    const file = event.target.files[0]; // FileList object
    this.currentFile = file;

    // Clear the selection in the file picker input.
    this.mediaInput.wrap('<form>').closest('form').get(0).reset();
    this.mediaInput.unwrap();

    // Only process image files.
    if (this.isImage() || this.isVideo()) {
      const reader = new FileReader();
      if (this.isImage()) {
        this.newVideoContainer.hide();
        this.newPictureContainer.show();
        reader.onload = (e) => this.displayPicture(e.target.result);
      }
      if (this.isVideo()) {
        this.newVideoContainer.show();
        this.newPictureContainer.hide();
        reader.onload = (e) => this.displayVideo(e.target.result);
      }
      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
      this.disableUploadUi(false);
    }
  }

  /**
   * Returns a Canvas containing the given image scaled down to the given max dimension.
   * @private
   * @static
   */
  static _getScaledCanvas(image, maxDimension) {
    const thumbCanvas = document.createElement('canvas');
    const imageWidth = image.width || image.videoWidth;
    const imageHeight = image.height || image.videoHeight;
    if (imageWidth > maxDimension ||
      imageHeight > maxDimension) {
      if (image.width > image.height) {
        thumbCanvas.width = maxDimension;
        thumbCanvas.height = maxDimension * imageHeight / imageWidth;
      } else {
        thumbCanvas.width = maxDimension * imageWidth / imageHeight;
        thumbCanvas.height = maxDimension;
      }
    } else {
      thumbCanvas.width = imageWidth;
      thumbCanvas.height = imageHeight;
    }
    thumbCanvas.getContext('2d').drawImage(image, 0, 0, imageWidth, imageHeight,
        0, 0, thumbCanvas.width, thumbCanvas.height);
    return thumbCanvas;
  }

  /**
   * Generates the full size image and image thumb using canvas and returns them in a promise.
   */
  async processImage() {
    const fullDeferred = new $.Deferred();
    const thumbDeferred = new $.Deferred();

    const resolveFullBlob = (blob) => fullDeferred.resolve(blob);
    const resolveThumbBlob = (blob) => thumbDeferred.resolve(blob);

    const displayPicture = (url) => {
      const image = new Image();
      image.src = url;

      // Generate thumb.
      const maxThumbDimension = Uploader.THUMB_IMAGE_SPECS.maxDimension;
      const thumbCanvas = Uploader._getScaledCanvas(image, maxThumbDimension);
      thumbCanvas.toBlob(resolveThumbBlob, 'image/jpeg', Uploader.THUMB_IMAGE_SPECS.quality);

      // Generate full sized image.
      const maxFullDimension = Uploader.FULL_IMAGE_SPECS.maxDimension;
      const fullCanvas = Uploader._getScaledCanvas(image, maxFullDimension);
      fullCanvas.toBlob(resolveFullBlob, 'image/jpeg', Uploader.FULL_IMAGE_SPECS.quality);
    };

    const reader = new FileReader();
    reader.onload = (e) => displayPicture(e.target.result);
    reader.readAsDataURL(this.currentFile);

    const results = await Promise.all([fullDeferred.promise(), thumbDeferred.promise()]);
    return {
      full: results[0],
      thumb: results[1],
    };
  }

  /**
   * Generates the full size image and image thumb using canvas and returns them in a promise.
   */
  async processVideo() {
    const fullDeferred = new $.Deferred();
    const thumbDeferred = new $.Deferred();

    const resolveFullBlob = (blob) => fullDeferred.resolve(blob);
    const resolveThumbBlob = (blob) => thumbDeferred.resolve(blob);

    const displayVideo = async (url) => {
      const video = await Uploader.createVideo(url, {initialTime: 0.75});

      // Generate thumb.
      const maxThumbDimension = Uploader.THUMB_IMAGE_SPECS.maxDimension;
      const thumbCanvas = Uploader._getScaledCanvas(video, maxThumbDimension);
      thumbCanvas.toBlob(resolveThumbBlob, 'image/jpeg', Uploader.THUMB_IMAGE_SPECS.quality);

      fetch(url).then((res) => res.blob()).then(resolveFullBlob);
    };

    const reader = new FileReader();
    reader.onload = (e) => displayVideo(e.target.result);
    reader.readAsDataURL(this.currentFile);

    const results = await Promise.all([fullDeferred.promise(), thumbDeferred.promise()]);
    return {
      full: results[0],
      thumb: results[1],
    };
  }

  isImage() {
    return this.currentFile && this.currentFile.type.match('image.*');
  }

  isVideo() {
    return this.currentFile && this.currentFile.type.match('video.*');
  }

  async processMedia() {
    let media = null;

    if (this.isImage()) {
      media = await this.processImage();
    }
    if (this.isVideo()) {
      media = await this.processVideo();
    }

    return media;
  }

  /**
   * Uploads the pic to Cloud Storage and add a new post into the Firebase Database.
   */
  async uploadMedia(e) {
    e.preventDefault();
    this.disableUploadUi(true);
    const mediaCaption = this.mediaCaptionInput.val();

    const media = await this.processMedia();

    if (!media) {
      return;
    }
    // Upload the File upload to Cloud Storage and create new post.
    try {
      const postId = await this.firebaseHelper.createPost(media.full, media.thumb, this.currentFile.name, mediaCaption);
      page(`/user/${this.auth.currentUser.uid}`);
      const data = {
        message: 'New media has been posted!',
        actionHandler: () => page(`/post/${postId}`),
        actionText: 'View',
        timeout: 10000,
      };
      MaterialUtils.showSnackbar(this.toast, data);
      this.disableUploadUi(false);
    } catch (error) {
      console.error(error);
      const data = {
        message: `There was an error while posting your media. Sorry!`,
        timeout: 5000,
      };
      MaterialUtils.showSnackbar(this.toast, data);
      this.disableUploadUi(false);
    }
  }

  /**
   * Clear the uploader.
   */
  clear() {
    this.currentFile = null;

    // Cancel all Firebase listeners.
    this.firebaseHelper.cancelAllSubscriptions();

    // Clear previously displayed pic.
    this.newPictureContainer.attr('src', '');

    // Clear the text field.
    MaterialUtils.clearTextField(this.mediaCaptionInput[0]);

    // Make sure UI is not disabled.
    this.disableUploadUi(false);
  }
};
