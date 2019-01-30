const path = require('path');
const { Service } = require('node-windows');

const serverScriptPath = path.join(__dirname, '/server/index.js');

const SVC = new Service({
  name: 'SoundCloud to Discord rich-presence',
  description: 'The background server to enable the rich-presence from SoundCloud to Discord.',
  script: serverScriptPath,
});

SVC.on('install', () => SVC.start());
SVC.install();
