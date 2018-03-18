const path = require('path');
const { Observable } = require('rxjs');
const svn = require('node-svn-ultimate');

const getChallenges = require('./seed/getChallenges');
const fs = require('fs-extra');
const { logger, chunkDocument } = require('../../utils');

const log = logger('data-source:challenges');

function dasherize(name) {
  return ('' + name)
    .toLowerCase()
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9\-\.]/gi, '')
    .replace(/\:/g, '');
}

function streamChallenges() {
  return Observable.from(getChallenges()).flatMap(({ name, challenges }) => {
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
    return Observable.of(formattedChallenges);
  });
}

const challengesDir = path.resolve(__dirname, './seed/challenges');

function getChallengeData() {
  return Observable.fromPromise(fs.remove(challengesDir))
    .do(() => log('challenges removed'))
    .flatMap(() =>
      Observable.fromPromise(
        new Promise((resolve, reject) => {
          svn.commands.checkout(
            'https://github.com/freecodecamp/freecodecamp/branches/master' +
              '/seed/challenges',
            challengesDir,
            err => {
              if (err) {
                log(err.message, 'red');
                reject(err);
              }
              log('got challenges');
              resolve();
            }
          );
        })
      )
    )
    .flatMap(streamChallenges);
}

module.exports = getChallengeData;
