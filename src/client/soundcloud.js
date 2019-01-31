(function () {
  const wsServerURL = 'http://127.0.0.1:7399';

  /** @type {jQuery} */
  const $ = window.$;

  /** @type {SocketIO.Socket} */
  const socket = window.io(wsServerURL);

  /** @type {string} */
  let actualTrackURL;

  /**
   * Custom logger with a prefix on each log output.
   *
   * @param  {...any} messages strings or variables you want to log
   */
  function _log(...messages) {
    /** @type {any[]} */
    const args = [].slice.call(messages);

    args.unshift(
      '%c[SoundCloud RP]%c',
      'color: #57AE5B; font-weight: bold;',
      'color: #05400A; font-weight: normal;',
    );

    console.log(...args);
  }

  /**
   * Get the track URL from the SoundCloud player track title.
   *
   * @returns {number | false} a track URL as a string or false if it can't be found
   */
  function _getCurrentTrackURL() {
    const trackEl = $('a.playbackSoundBadge__titleLink');

    if (trackEl.length) {
      return `https://soundcloud.com${trackEl.attr('href')}`;
    }

    _log('unable to retrieve current track URL because the player doesn\'t exist or is not found in the DOM');
    return false;
  }

  /**
   * Get the current track progression in seconds from the bar-progress.
   *
   * @returns {number | false} a number in seconds or false if it can't be found
   */
  function _getTrackProgression() {
    const progressEl = $('.playbackTimeline__progressWrapper');

    if (progressEl.length) {
      const trackProgressionSeconds = progressEl.attr('aria-valuenow');
      return parseInt(trackProgressionSeconds, 10);
    }

    _log('unable to retrieve current progression because the player doesn\'t exist or is not found in the DOM');
    return false;
  }

  /**
   * Main loop which detects if this is a new track, then send a payload with
   * track URL + progression.
   */
  function _loop() {
    const currentTrackURL = _getCurrentTrackURL();
    const trackProgression = _getTrackProgression();

    if (currentTrackURL !== actualTrackURL && currentTrackURL && socket.connected) {
      const payload = {
        trackURL: currentTrackURL,
        progression: trackProgression,
      };

      actualTrackURL = currentTrackURL;

      socket.emit('rp-update', payload);
      _log('new track detected, sending payload...', payload);
    }
  }

  socket.on('connect', () => {
    _log('connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    _log('disconnected from WebSocket server, trying to reconnect...');
  });

  socket.on('reconnect', () => {
    _log('successfully reconnected to WebSocket server');

    actualTrackURL = undefined;
  });

  setInterval(() => _loop(), 5000);
}());
