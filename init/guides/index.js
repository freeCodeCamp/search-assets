const path = require('path');
const Rx = require('rxjs');
const svn = require('node-svn-ultimate');
const fse = require('fs-extra');
const { logger, chunkDocument, readDir } = require('../../utils');
const { titleify } = require('./utils');
const { client } = require('../../algolia');

const log = logger('guides');
const { Observable } = Rx;

const index = client.initIndex('init:guides');

index.setSettings(
  {
    searchableAttributes: ['title', 'content'],
    distinct: true,
    attributeForDistinct: 'objectID'
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

const articlesDir = path.resolve(__dirname, './svn');
let articles = [];

function buildAndInsert(dirLevel) {
  const filePath = `${dirLevel}/index.md`;
  fse.open(filePath, 'r', err => {
    if (err) {
      if (err.code === 'ENOENT') {
        log(
          `index.md does not exist in ${filePath.replace(/index\.md$/, '')}`,
          'yellow'
        );
      }
      log(err.message, 'red');
      return;
    }
    fse.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
        log(err.message, 'red');
      }
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
        objectID: url.replace('/', '-')
      };
      articles = [
        ...articles,
        ...chunkDocument(article, ['title', 'url', 'objectID'], 'content')
      ];

      if (articles.length >= 150) {
        index.addObjects(articles, err => {
          if (err) {
            throw new Error(err);
          }
          log(`${articles.length} articles inserted`);
        });
        articles = [];
      }
    });
  });
}

function parseArticles(dirLevel) {
  return Observable.from(readDir(dirLevel)).flatMap(dir => {
    const dirPath = `${dirLevel}/${dir}`;
    const subDirs = readDir(dirPath);
    if (!subDirs) {
      buildAndInsert(dirPath);
      return Observable.of(null);
    }
    buildAndInsert(dirPath);
    return parseArticles(dirPath);
  });
}

function getGuideArticleData() {
  fse.remove(articlesDir, err => {
    if (err) {
      console.error(err.message);
      throw new Error(err.stack);
    }
    svn.commands.checkout(
      'https://github.com/freecodecamp/guides/trunk/src/pages',
      articlesDir,
      err => {
        if (err) {
          log(err.message, 'red');
          throw new Error(err.stack);
        }
        log('got guides');
        parseArticles(articlesDir).subscribe(
          dir => {
            if (dir) {
              parseArticles(dir);
            }
          },
          err => {
            log(err.message, 'red');
            throw new Error(err);
          },
          () => {
            if (articles.length > 0) {
              index.addObjects(articles, err => {
                if (err) {
                  throw new Error(err);
                }
                log(`${articles.length} articles inserted`);
              });
            }
            log('COMPLETE');
          }
        );
      }
    );
  });
}

module.exports = getGuideArticleData;
