const path = require('path');
const Rx = require('rxjs');
const svn = require('node-svn-ultimate');
const fse = require('fs-extra');
const { logger, chunkDocument, listDirectory } = require('../../utils');
const { titleify } = require('./utils');

const log = logger('data-source:guides');
const { Observable } = Rx;

const articlesDir = path.resolve(__dirname, './svn');

function buildArticle(dirLevel) {
  const filePath = `${dirLevel}/index.md`;
  try {
    fse.openSync(filePath, 'r');
  } catch (err) {
    if (err) {
      if (err.code === 'ENOENT') {
        log(
          `index.md does not exist in ${filePath.replace(/index\.md$/, '')}`,
          'yellow'
        );
      }
      log(err.message, 'red');
      return [];
    }
  }
  const content = fse.readFileSync(filePath, 'utf-8');
  const title = dirLevel
    .slice(0)
    .split('/')
    .slice(-1)
    .join('');
  const pageTitle = titleify(title);
  const url = dirLevel
    .split('/')
    .slice(dirLevel.split('/').indexOf('svn') + 1)
    .join('/')
    .toLowerCase();
  const article = {
    content,
    title: pageTitle,
    url: `/${url}`,
    id: url.replace('/', '-')
  };
  return chunkDocument(article, ['title', 'url', 'id'], 'content');
}

function articleStream(dirLevel) {
  return Observable.from(listDirectory(dirLevel)).flatMap(buildArticle);
}

function getGuideArticleData() {
  return Observable.fromPromise(fse.remove(articlesDir))
    .do(() => log('guides removed'))
    .flatMap(() =>
      Observable.fromPromise(
        new Promise((resolve, reject) => {
          svn.commands.checkout(
            'https://github.com/freecodecamp/guides/trunk/src/pages',
            articlesDir,
            err => {
              if (err) {
                log(err.message, 'red');
                reject();
              }
              log('got guides');
              resolve();
            }
          );
        })
      )
    )
    .flatMap(() => articleStream(articlesDir))
    .toArray();
}

exports.getGuideArticleData = getGuideArticleData;
