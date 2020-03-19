const axios = require('axios').default;

/**
 * Retrieve an image from an URL then transform it into a base64 string.
 *
 * @param {string} url url to an image
 * @returns {Promise<string>} a promise with the image in a base64 string
 */
function retrieveImageFromURL(url) {
  return axios
    .get(url, { responseType: 'arraybuffer' })
    .then((response) => Buffer.from(response.data, 'binary').toString('base64'))
    .then((encoded) => 'data:image/jpeg;base64,'.concat(encoded))
    .catch((err) => err);
}

module.exports = { retrieveImageFromURL };
