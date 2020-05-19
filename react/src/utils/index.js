const FULL_SIZE = 1280;
const FULL_QUALITY = 0.9
const THUMB_SIZE = 640;
const THUMB_QUALITY = 0.7;

export const isVideo = (type) => type && type.startsWith('video');
export const isImage = (type) => type && type.startsWith('image');

export const addSizeToGoogleProfilePic = (url) => {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
};

export const getFile = (event) => {
  const { files } = event.target || {};
  const file = (files || [])[0];
  return file;
};

export const getFileData = (event) => new Promise((resolve) => {
  const file = getFile(event);
  if (!file) {
    resolve(null);
  }
  const reader = new FileReader();
  reader.onload = (event) => resolve({ dataURL: event.target.result, type: file.type });
  reader.readAsDataURL(file);
});

export const toImageBlob = (media, maxSize, quality, format = 'image/jpeg') => new Promise((resolve) => {
  const сanvas = document.createElement('canvas');
  const ctx = сanvas.getContext('2d');
  const width = media.width || media.videoWidth;
  const height = media.height || media.videoHeight;
  if (maxSize) {
    const maxDimension = Math.max(width, height);
    const minDimension = Math.min(width, height);
    const ratio = minDimension / maxDimension;
    const thumbMaxDimension = Math.min(maxDimension, maxSize);
    const thumbMinDimension = thumbMaxDimension * ratio;
    сanvas.width = (width > height) ? thumbMaxDimension : thumbMinDimension;
    сanvas.height = (width > height) ? thumbMinDimension : thumbMaxDimension;
  } else {
    сanvas.width = width;
    сanvas.height = height;
  }
  ctx.drawImage(media, 0, 0, сanvas.width, сanvas.height);
  сanvas.toBlob(resolve, format, quality);
});

export const toRawBlob = (dataURL) => fetch(dataURL).then(res => res.blob())

export const createImage = (url) => {
  const img = new Image();
  img.src = url;
  return img;
};

export const createVideo = (url, initialTime = 0.75) => {
  const video = document.createElement('video');
  video.src = url;
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
};

export const processFileData = async ({ dataURL, type }, thumbFormat) => {
  if (isImage(type)) {
    const image = createImage(dataURL);
    const fullBlob = await toImageBlob(image, FULL_SIZE, FULL_QUALITY, type);
    const thumbBlob = await toImageBlob(image, THUMB_SIZE, THUMB_QUALITY, thumbFormat);
    return { full: fullBlob, thumb: thumbBlob };
  }
  if (isVideo(type)) {
    const video = await createVideo(dataURL);
    const fullBlob = await toRawBlob(dataURL);
    const thumbBlob = await toImageBlob(video, THUMB_SIZE, THUMB_QUALITY, thumbFormat);
    return { full: fullBlob, thumb: thumbBlob };
  }
  throw new Error('Unsupported type');
};

export const uploadFile = async (mediaRef, blob) => {
  const snapshot = await mediaRef.put(blob, { type: blob.type });
  const url = await snapshot.ref.getDownloadURL();
  return url;
};

export const deleteFile = async (fileURI, storage) => {
  if (fileURI.startsWith('gs:/')) {
    return storage.refFromURL(fileURI).delete();
  } else {
    return storage.ref(fileURI).delete();
  }
};

export const deletePost = async (postId, user, database, storage) => {
  const post = await database.ref(`/posts/${postId}`).once('value').then(snapshot => snapshot.val());
  const { full_storage_uri, thumb_storage_uri } = post;
  console.log(`Deleting ${postId}`);
  const updateObj = {};
  updateObj[`/people/${user.uid}/posts/${postId}`] = null;
  updateObj[`/comments/${postId}`] = null;
  updateObj[`/likes/${postId}`] = null;
  updateObj[`/posts/${postId}`] = null;
  updateObj[`/feed/${user.uid}/${postId}`] = null;
  const deleteFromDatabase = database.ref().update(updateObj);
  await Promise.all([
    deleteFromDatabase,
    full_storage_uri && deleteFile(full_storage_uri, storage),
    thumb_storage_uri && deleteFile(thumb_storage_uri, storage),
  ].filter(item => !!item));
};

export const getHumanTime = (postCreationTimestamp) => {
  if (!postCreationTimestamp) {
    return '...';
  }
  let millis = Date.now() - postCreationTimestamp;
  const ms = millis % 1000;
  millis = (millis - ms) / 1000;
  const secs = millis % 60;
  millis = (millis - secs) / 60;
  const mins = millis % 60;
  millis = (millis - mins) / 60;
  const hrs = millis % 24;
  const days = (millis - hrs) / 24;
  const timeSinceCreation = [days, hrs, mins, secs, ms];

  let timeText = 'Now';
  if (timeSinceCreation[0] !== 0) {
    timeText = timeSinceCreation[0] + 'd';
  } else if (timeSinceCreation[1] !== 0) {
    timeText = timeSinceCreation[1] + 'h';
  } else if (timeSinceCreation[2] !== 0) {
    timeText = timeSinceCreation[2] + 'm';
  }
  return timeText;
};
