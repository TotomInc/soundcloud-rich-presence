require('dotenv').config();

const path = require('path');
const app = require('express')();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

const soundcloudAPI = require('./soundcloud-api');
const richPresence = require('./rich-presence');
const rpc = require('./rpc-wrapper');

httpServer.listen(7399);

app.get('/soundcloud.js', (req, res) => {
  const soundcloudPath = path.join(__dirname, '../client/soundcloud.js');

  res.setHeader('Content-type', 'application/javascript');
  res.sendFile(soundcloudPath);
});

io.on('connection', (socket) => {
  console.log('user socket connected');

  socket.on('disconnect', async () => {
    console.log(
      'client socket disconnected, clearing the rich-presence state...',
    );

    rpc
      .clearActivity()
      .then(() => console.log('successfully cleared the rich-presence state'));
  });

  socket.on('rp-update', async (track) => {
    const { trackURL, progression } = track;

    const assetList = await richPresence
      .getAssetList()
      .then((response) => response.data);

    if (assetList.length >= richPresence.MAX_ASSETS) {
      await richPresence.deleteOldAssets(assetList, 25);
    }

    const rawTrackData = await soundcloudAPI
      .resolveTrackURL(trackURL)
      .then((response) => response.data);

    const trackData = {
      title: rawTrackData.title,
      author: rawTrackData.user.username,
      trackArtworkURL: soundcloudAPI.getArtworkURL(rawTrackData.artwork_url),
      authorArtworkURL: soundcloudAPI.getArtworkURL(
        rawTrackData.user.avatar_url,
      ),
      permalinkURL: rawTrackData.permalink_url,
      duration: rawTrackData.duration,
    };

    const trackArtworkAssetID = await richPresence
      .uploadAsset(trackData.trackArtworkURL)
      .then((response) => response.data.name);

    const authorArtworkAssetID = await richPresence
      .uploadAsset(trackData.authorArtworkURL)
      .then((response) => response.data.name);

    const richPresencePayload = {
      ...trackData,
      progression,
      trackArtworkAssetID,
      authorArtworkAssetID,
    };

    await rpc
      .setActivity(richPresencePayload)
      .then(() =>
        console.log(
          'new rich-presence state successfully setup',
          richPresencePayload,
        ),
      );
  });
});
