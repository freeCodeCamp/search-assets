const { client } = require('../algolia');
const getGuideArticleData = require('../data-sources/guides');
const { logger } = require('../utils');

const log = logger('init:guides');

const index = client.initIndex('guides');

index.setSettings(
  {
    searchableAttributes: ['title', 'content'],
    distinct: true,
    attributeForDistinct: 'id'
  },
  (err, response) => {
    if (err) {
      log(err.message, 'red');
      log(err.debugData);
      throw new Error(err);
    }
    log('setSettings\n' + JSON.stringify(response, null, 2));
  }
);

exports.insertGuides = function insertGuides() {
  return getGuideArticleData().subscribe(
    articles => {
      index.addObjects(articles, err => {
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
