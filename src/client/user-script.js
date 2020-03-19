// ==UserScript==
// @name        SoundCloud to Discord rich-presence
// @namespace   https://github.com/soundcloud-rich-presence
// @version     0.0.1
// @description Set your Discord rich-presence to what you are actually listening on SoundCloud (similar to Spotify). Requires the background server task to be running.
// @author      TotomInc <cazade.thomas@gmail.com>
// @match       https://soundcloud.com/*
// @grant       none
// ==/UserScript==

/* eslint func-names: "off" */
(function() {
  /** The URL of the full script to load */
  const scriptURL = 'http://127.0.0.1:7399/soundcloud.js';

  /**
   * An array of required dependencies to load before loading the full-script
   */
  const dependenciesURLs = [
    'https://unpkg.com/jquery@3.3.1/dist/jquery.min.js',
    'https://unpkg.com/socket.io-client@2.2.0/dist/socket.io.js',
  ];

  /** Reference to the `<head>` element */
  const head = document.getElementsByTagName('head')[0];

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
   * Automatically load dependencies from a CDN and return a promise which
   * waits for all of them to be fully loaded.
   *
   * @param {string[]} depsURLs an array of dependencies URLs to load
   */
  function loadDependencies(depsURLs) {
    /** @type Promise<string>[] */
    const depsPromises = [];

    depsURLs.forEach((depURL) => {
      const depPromise = new Promise((res, rej) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = depURL;
        script.onload = () => {
          _log('successfully loaded dependency:', depURL);
          return res(depURL);
        };
        script.onerror = (err) => rej(err);

        head.appendChild(script);
      });

      depsPromises.push(depPromise);
    });

    return Promise.all(depsPromises);
  }

  /**
   * Load the full SoundCloud script from the `scriptURL`, make sure we call
   * this function after loading all dependencies. Returns a promise which
   * is resolved when the SoundCloud script is loaded.
   */
  function loadSoundcloudScript() {
    return new Promise((res, rej) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptURL;
      script.onload = () => {
        _log('successfully loaded soundcloud script:', scriptURL);
        return res(scriptURL);
      };
      script.onerror = (err) => rej(err);

      head.appendChild(script);
    });
  }

  // Load dependencies then load the SoundCloud script
  loadDependencies(dependenciesURLs)
    .then(() => loadSoundcloudScript())
    .catch((err) => err);
})();
