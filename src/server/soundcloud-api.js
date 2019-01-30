// eslint-disable-next-line
const Axios = require('axios');
const axios = require('axios').default;

const clientID = process.env.SOUNDCLOUD_CLIENT_ID;

const resolveBaseURL = 'http://api.soundcloud.com/resolve.json';

/**
 * @param {string} url a SoundCloud track URL to resolve
 * @returns {Axios.AxiosPromise<any>}
 */
function resolveTrackURL(url) {
  const params = {
    url,
    client_id: clientID,
  };

  return axios.get(resolveBaseURL, { params })
    .then((res) => res)
    .catch((err) => err);
}

/**
 * Replace the URL of the small thumbnail to a large 500x500 image.
 *
 * @param {string} url the artwork URL which is a small thumbnail
 */
function getArtworkURL(url) {
  return url.replace('large', 't500x500');
}

module.exports = { resolveTrackURL, getArtworkURL };
