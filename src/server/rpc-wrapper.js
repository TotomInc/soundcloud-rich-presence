// eslint-disable-next-line
const RPC = require('discord-rpc');
const { Client } = require('discord-rpc');

const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID;

class RPCWrapper {
  /**
   * @param {RPC.Client} rpc
   */
  constructor(rpc) {
    this.rpc = rpc;
    this.status = false;
    this.currentActivity = false;

    this._initRPC();
  }

  /**
   * Initialize the RPC events then try to connect, called by the constructor.
   */
  _initRPC() {
    this.status = false;
    this.rpc.on('ready', () => console.log('RPC client ready'));

    this._connect();
  }

  /**
   * Try to connect to Discord using a `BOT_CLIENT_ID`. Automatically update
   * the `status` when connected or not.
   */
  _connect() {
    this.rpc.login({ clientId: BOT_CLIENT_ID })
      .then(() => {
        console.log('RPC connected to Discord');

        this.status = true;
      })
      .catch((err) => {
        console.log('Failed to connect to Discord');
        console.error(err);

        this.status = false;
      });
  }

  getActivity() {
    return this.currentActivity;
  }
}

/** Generate a `RPC.Client` to be passed into the `RPCWrapper` */
const rpc = new Client({ transport: 'ipc' });

module.exports = new RPCWrapper(rpc);
