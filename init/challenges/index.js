const path = require('path');
const { Observable } = require('rxjs');
const svn = require('node-svn-ultimate');

const { client } = require('../../algolia');
const getChallenges = require('./seed/getChallenges');
const fs = require('fs-extra');
const { logger, chunkDocument } = require('../../utils');

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

function dasherize(name) {
  return ('' + name)
    .toLowerCase()
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9\-\.]/gi, '')
    .replace(/\:/g, '');
}

function parseAndInsert() {
  Observable.from(getChallenges())
    .flatMap(({ name, challenges }) => {
      const block = dasherize(name);
      const formattedChallenges = challenges
        .filter(({ isPrivate }) => !isPrivate)
        .reduce((acc, current) => {
          const { id, title, description } = current;
          const dashedName = dasherize(title);

          const formattedChallenge = {
            blockName: name,
            objectID: id,
            title,
            description: description ? description.join('').trim() : '',
            url: `https://freecodecamp.org/challenges/${block}/${dashedName}`
          };
          return [
            ...acc,
            ...chunkDocument(
              formattedChallenge,
              ['title', 'objectID', 'blockName', 'url'],
              'description'
            )
          ];
        }, []);
      return Observable.of({
        block,
        challenges: formattedChallenges
      });
    })
    .subscribe(
      ({ block, challenges }) => {
        index.addObjects(challenges, err => {
          if (err) {
            throw new Error(err);
          }
          log(`${block} challenges inserted`);
        });
      },
      err => {
        log(err.message, 'red');
        log(err.debugData, 'yellow');
      },
      () => {
        log('COMPLETE');
      }
    );
}

const challengesDir = path.resolve(__dirname, './seed/challenges');

function getChallengeData() {
  fs.remove(challengesDir, err => {
    if (err) {
      log(err.message, 'red');
      throw new Error(err);
    }
    log('challenges removed');
    svn.commands.checkout(
      'https://github.com/freecodecamp/freecodecamp/branches/master' +
        '/seed/challenges',
      challengesDir,
      err => {
        if (err) {
          log(err.message, 'red');
          throw new Error(err.stack);
        }
        log('got challenges');
        parseAndInsert();
      }
    );
  });
}

module.exports = getChallengeData;
