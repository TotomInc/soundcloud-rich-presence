const moment = require('moment');
const { Client } = require('discord-rpc');

const { BOT_CLIENT_ID } = process.env;

const connectionWaitInterval = 10;

class RPCWrapper {
  /**
   * @param {import('discord-rpc').Client} rpc
   */
  constructor(rpc) {
    this.rpc = rpc;
    this.status = false;

    this._initRPC();
  }

  /**
   * Initialize the RPC events then try to connect, called by the constructor.
   *
   * @param connect {boolean} try to connect after init, set to true by default
   */
  _initRPC(connect = true) {
    this.status = false;
    this.rpc.on('ready', () =>
      console.log(`RPC client ready, logged in as ${this.rpc.user.username}`),
    );

    if (connect) {
      this._connect();
    }
  }

  /**
   * Try to connect to Discord using a `BOT_CLIENT_ID`. Automatically update
   * the `status` when connected or not. Return the promise which is resolved
   * when the rpc is connected.
   *
   * @param retry {boolean} retry flag, set to false by default
   */
  _connect(retry = false) {
    if (retry) {
      this.rpc = new Client({ transport: 'ipc' });

      this._initRPC(false);
    }

    return this.rpc
      .login({ clientId: BOT_CLIENT_ID })
      .then(() => {
        console.log('RPC connected to Discord');

        this.status = true;
      })
      .catch((err) => {
        console.log(
          `Failed to connect to Discord, trying to reconnect again in ${connectionWaitInterval} seconds`,
        );
        console.error(err);

        this.status = false;

        setTimeout(() => this._connect(true), connectionWaitInterval * 1000);
      });
  }

  /**
   * Set a new rich-presence state.
   *
   * @param {any} data track data from SoundCloud and artworks IDs (keys)
   */
  setActivity(data) {
    const {
      title,
      author,
      duration,
      progression,
      trackArtworkAssetID,
      authorArtworkAssetID,
    } = data;

    const startTimestamp = moment(+new Date() + progression * 1000).unix();
    const endTimestamp = moment(+new Date() + duration).unix();

    /** @type {RPC.Presence} */
    const payload = {
      details: title,
      state: author,
      largeImageKey: trackArtworkAssetID,
      largeImageText: title,
      smallImageKey: authorArtworkAssetID,
      smallImageText: author,
      instance: false,
      startTimestamp,
      endTimestamp,
    };

    return this.rpc.setActivity(payload);
  }

  /**
   * Remove rich-presence status.
   */
  clearActivity() {
    return this.rpc.clearActivity();
  }
}

/** Generate a `RPC.Client` to be passed into the `RPCWrapper` */
const rpc = new Client({ transport: 'ipc' });

module.exports = new RPCWrapper(rpc);
