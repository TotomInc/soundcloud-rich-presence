require('dotenv').config();

const path = require('path');
const app = require('express')();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

const soundcloudAPI = require('./soundcloud-api');

httpServer.listen(7399);

app.get('/soundcloud.js', (req, res) => {
  const soundcloudPath = path.join(__dirname, '../client/soundcloud.js');

  res.setHeader('Content-type', 'application/javascript');
  res.sendFile(soundcloudPath);
});

io.on('connection', (socket) => {
  console.log('user socket connected');

  socket.on('rp-update', (track) => {
    const { trackURL, progression } = track;

    soundcloudAPI.resolveTrackURL(trackURL)
      .then((res) => {
        const { title, artwork_url, user: { username, avatar_url } } = res.data;
      });
  });
});
