const { client } = require('../algolia');
const { logger } = require('../utils');
const getChallengeData = require('../data-sources/challenges');

const log = logger('init:challenge');

const index = client.initIndex('challenges');

index.setSettings(
  {
    searchableAttributes: ['title', 'description', 'blockName'],
    distinct: true,
    attributeForDistinct: 'objectID'
  },
  (err, response) => {
    if (err) {
      log(err.message, 'red');
      log(err.debugData);
      throw new Error(err);
    }
    log('setSettings\n\n' + JSON.stringify(response, null, 2));
  }
);

exports.insertChallenges = function insertChallenges() {
  return getChallengeData().subscribe(
    challenges => {
      index.addObjects(challenges, err => {
        if (err) {
          throw new Error(err);
        }
      });
    },
    err => {
      throw new Error(err);
    },
    () => log('complete', 'blue')
  );
};
