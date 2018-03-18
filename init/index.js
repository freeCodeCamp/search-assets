const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });
const { Observable } = require('rxjs');

/*
* The below has been commented out to aviod inadvertant ops usage with algolia
*/

// const { getStoryData } = require('./news');
// const { insertYoutube } = require('./youtube');
// const { insertChallenges } = require('./challenges');
// const { insertGuides } = require('./guides');

const dataSources = [
  // insertGuides
  // insertYoutube
  // insertChallenges
  // disable this until the roll out of news
  // getStoryData
];

function init() {
  Observable.zip(
    Observable.timer(0, 2000),
    Observable.from(dataSources),
    (a, b) => b
  ).subscribe(fn => {
    fn();
  });
}

init();
