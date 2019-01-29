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

module.exports = { resolveTrackURL };
