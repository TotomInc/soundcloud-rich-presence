require('dotenv').config();

// eslint-disable-next-line
const Axios = require('axios');
const axios = require('axios').default;

const imageProcessing = require('./image-processing');

const botToken = process.env.BOT_CLIENT_TOKEN;
const botID = process.env.BOT_CLIENT_ID;

/** The amount of assets to store before deleting old ones. */
const MAX_ASSETS = 100;

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
 * @param {number} [numToDelete] number of assets to delete (10 by default)
 */
async function deleteOldAssets(assets, numToDelete = 10) {
  const assetsToDelete = assets.splice(0, numToDelete);

  const deleteAssetPromises = assetsToDelete.map(
    (asset) => new Promise(
      (resolve, reject) => deleteAsset(asset.id)
        .then((response) => resolve(response))
        .catch((err) => reject(err))
      )
    );
    
  return Promise.all(deleteAssetPromises);
}

module.exports = {
  getAssetList, uploadAsset, deleteAsset, deleteOldAssets, MAX_ASSETS,
};
