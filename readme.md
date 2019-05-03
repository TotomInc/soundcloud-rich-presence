# SoundCloud rich-presence for Discord

> A lightweight background service to run on the same computer which runs Discord and set your rich-presence status to what you are listening on SoundCloud.

## Setting up

Make sure you have the following dependencies/tools:

- NodeJS 10+
- NPM 6+ (Yarn is recommended)
- Git
- A user-script extension on your web-browser (I recommend [Tampermonkey](https://tampermonkey.net/))

1. Clone the repo
2. Copy the `.env.example` as `.env` and fill the required variables
3. Run `npm i`
4. Execute server (it will auto launch/restart):
   - For Windows users:
     - run `node src/windows-service.js`, it will create a Windows service which can you can access with `services.msc`
   - For Mac OS users:
     - install PM2 `npm i -g pm2`
     - run `pm2 start src/server/index.js --name soundcloud-rich-presence`, this will start the server
     - run `pm2 save && pm2 startup`, copy the command to execute under the line where PM2 says "To setup the startup script, ..."
     - paste the command and run it, it will ask for password (this is normal, as pm2 is editing the `launchd` file which is in the filesystem)
     - you're done, make sure everything is good by running `pm2 list`, you should see the `soundcloud-rich-presence` script running
   - For Linux users: coming soon... if you can't wait and know what you are doing, create a `soundcloud-rich-presence.service` file and register it in `systemd` with `systemctl` command
5. Now we can install the user-script, [copy the content of the user-script](https://raw.githubusercontent.com/TotomInc/soundcloud-rich-presence/master/src/client/user-script.js)
6. Paste the content on a new user-script, it will automatically be enabled when you are on `https://soundcloud.com`

If it doesn't work...

- Try to navigate to `127.0.0.1:7399/soundcloud.js`, if there is nothing it means the server is not online.
- Try to restart the server when the rich-presence is not updated (or try to change track). The rich-presence status is updated only when a new track is detected.
