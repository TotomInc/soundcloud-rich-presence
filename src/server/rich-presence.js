require('dotenv').config();

// eslint-disable-next-line
const Axios = require('axios');
const axios = require('axios').default;

const imageProcessing = require('./image-processing');

const botToken = process.env.BOT_CLIENT_TOKEN;
const botID = process.env.BOT_CLIENT_ID;

/** The max. amount of assets that can be stored */
const MAX_ASSETS = 150;

const baseURL = 'https://discordapp.com/api/oauth2/applications';

/**
 * Get a list of all assets stored in the bot rich-presence.
 *
 * @returns {Axios.AxiosPromise<any>} return an axios-promise response
 */
async function getAssetList() {
  const headers = {
    authorization: botToken,
  };

  return axios.get(`${baseURL}/${botID}/assets`, { headers })
    .then((res) => res)
    .catch((err) => err);
}

/**
 * Upload an asset, image must be a base64 string.
 *
 * @param {string} url the image url of the resource to fetch and upload
 * @returns {Axios.AxiosPromise<any>} return an axios-promise response
 */
async function uploadAsset(url) {
  const headers = {
    authorization: botToken,
    'content-type': 'application/json',
  };

  const data = {
    image: await imageProcessing.retrieveImageFromURL(url),
    name: +new Date(),
    type: '1',
  };

  return axios.post(`${baseURL}/${botID}/assets`, data, { headers })
    .then((res) => res)
    .catch((err) => err);
}

/**
 * Delete a specific asset based on its ID.
 *
 * @param {string} id id of the asset to delete
 * @returns {Axios.AxiosPromise<any>} return an axios-promise response
 */
async function deleteAsset(id) {
  const headers = {
    authorization: botToken,
  };

  return axios.delete(`${baseURL}/${botID}/assets/${id}`, { headers })
    .then((res) => res)
    .catch((err) => err);
}

/**
 * Delete the 10 oldest assets, called when the max assets length is reached.
 *
 * @param {any[]} assets an array of pre-fetched assets
 */
async function deleteOldAssets(assets) {
  const assetsToDelete = assets.shift(10);
  const deletePromises = assetsToDelete.map((asset) => new Promise((resolve, reject) => deleteAsset(asset.id)
    .then((response) => resolve(response))
    .catch((err) => reject(err))));

  return Promise.all(deletePromises);
}

module.exports = {
  getAssetList, uploadAsset, deleteAsset, deleteOldAssets, MAX_ASSETS,
};
