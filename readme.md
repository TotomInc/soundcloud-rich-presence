# SoundCloud rich-presence for Discord

> A lightweight NodeJS server to run on the same computer which runs Discord and set your rich-presence status to what you are actually listening on SoundCloud.

## Setting up

### Installation

Make sure you have the following dependencies/tools:

- NodeJS 10+
- NPM 6+ (Yarn is recommended)
- Git
- A user-script extension on your web-browser (I recommend [Tampermonkey](https://tampermonkey.net/))

### Project setup

1. Clone the repo (or download as .zip).
2. Copy the `.env.example` as `.env` and edit the values. For more detail about this step, see the `.env.example` file which contains comments
3. Run `npm i` or `yarn`
4. Start the server:
   - Using `pm2`:
     - install PM2 `npm i -g pm2`
     - run `pm2 start src/server/index.js --name soundcloud-rich-presence`, this will start the server and you can now close the terminal
5. Now you can install the user-script on the browser, [copy the content of the user-script](https://raw.githubusercontent.com/TotomInc/soundcloud-rich-presence/master/src/client/user-script.js)
6. Paste the content on a new user-script, it will automatically be enabled when you are on `https://soundcloud.com` (refresh SoundCloud if you already are on it)

**Note for Windows users**: you need to do `pm2 start src/server/index.js --name soundcloud-rich-presence` everytime you shutdown and start your computer, as processes are not kept and automatically loaded on boot (sorry, this is the default behavior of Windows 🤷).

However, on MacOS and Linux you can generate a startup script for `pm2` (`launchd` for MacOS), [see their documentation about that](http://pm2.keymetrics.io/docs/usage/startup/#generating-a-startup-script).

## Troubleshooting

If it doesn't work:

- Try to navigate to `127.0.0.1:7399/soundcloud.js`. If there is nothing, it means the server is not up and it may crashed.
- Try to restart the server when the rich-presence is not updated (or try to change track). The rich-presence status is updated only when a new track is detected.
