# Build_System
A system to check build status

This is a client web application used for mimicking a Build System in its best way possible :). I used a trader desktop server to supply me with mock data and Server Send Events.

Clone this repo or Download the zip and extract the contents:

## Lets Start the server
Navigate to trader_server and run
```bash
$ npm install
$ npm start
```

## Quick Start
Back to the main folder and run:
```bash
$ npm install
$ bower install
$ gulp serve-dev
```
- `npm install` will install the required node libraries under `node_modules`.
- `bower install` will install the required client-side libraries under `bower_components`.
- `gulp serve-dev` will serve up the Angular application in a browser window.


Click on create button to create the numer of build scenarios, then based on Socket Server Send Events the progress bar is updated. Once all tasks are completed, you can delete the contents and try again creating another set of builds by clicking the create button. Click on the chart icon on top right corner to get the chart implementation of the same data, using the library d3.
##### Note
Make sure you have "bower_components\socket.io-client\bower.json" file, which was not available in original repo.

