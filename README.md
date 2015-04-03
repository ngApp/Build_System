# Build_System
A system to check build status

This is a client web application used for mimicking a Build System in its best way possible :). I used a trader desktop server to supply me with mock data and Server Send Events.



## Quick Start
Clone this repo and run the content locally:
```bash
$ npm install
$ bower install
$ gulp serve-dev
```
- `npm install` will install the required node libraries under `node_modules`.
- `bower install` will install the required client-side libraries under `bower_components`.
- `gulp serve-dev` will serve up the Angular application in a browser window.

##### Note
Make sure you have "bower_components\socket.io-client\bower.json" file, which was not available in original repo.

