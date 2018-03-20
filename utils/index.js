const { Observable } = require('rxjs');
const fse = require('fs-extra');
const chalk = require('chalk');
const format = require('date-fns/format');
const file = require('file');
const _ = require('lodash');
const { isURL } = require('validator');
const stripTags = require('striptags');
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

exports.logger = function logger(namespace = 'AnonDebug') {
  return (str = 'We need something to log', colour = 'green') => {
    const TS = format(new Date().getTime(), 'DD MMM YY - HH:mm:ss Z');
    console.log(chalk[colour](`${TS} (${namespace}): ${str}`));
  };
};

const isAFileRE = /(\.md|\.jsx?|\.html?)$/;
const isJSRE = /\.jsx?$/;
const shouldBeIgnoredRE = /^(\_|\.)/;
const excludedDirs = ['search'];
const guideSvnRE = /guides\/svn$/;

exports.isAFileRE = isAFileRE;
exports.isJSRE = isJSRE;
exports.shouldBeIgnoredRE = shouldBeIgnoredRE;
exports.excludedDirs = excludedDirs;

/*
*                   *
* Directory Helpers *
*                   *
*/

exports.listDirectory = function listDirectory(start) {
  let allDirs = [];
  file.walkSync(start, dirPath => {
    if (dirPath.includes('.svn')) {
      return;
    }
    allDirs = [...allDirs, dirPath];
  });
  return allDirs.filter(name => !guideSvnRE.test(name));
};

function readDir(dir = __dirname, returnFiles = false) {
  const dirContent = fse
    .readdirSync(dir)
    .filter(dir => !excludedDirs.includes(dir))
    .filter(file => !(shouldBeIgnoredRE.test(file) || isJSRE.test(file)))
    .filter(file => file !== 'LICENSE.md');
  return returnFiles
    ? dirContent
    : dirContent.filter(item => !isAFileRE.test(item));
}

exports.readDir = readDir;

exports.parseDirectory = function parseDirectory(dirLevel, cb) {
  return Observable.from(readDir(dirLevel)).flatMap(dir => {
    const dirPath = `${dirLevel}/${dir}`;
    const subDirs = readDir(dirPath);
    if (!subDirs) {
      cb(dirPath);
      return Observable.of(null);
    }
    cb(dirPath);
    return parseDirectory(dirPath, cb);
  });
};

/*
*                  *
* Document Helpers *
*                  *
*/

exports.chunkDocument = function chunkDocument(doc, pickFields, chunkField) {
  const baseDoc = _.pick(doc, pickFields);
  const chunks = doc[chunkField].match(/[\w']+(?:[\n\s]+[\S]+){1,100}/g);
  if (!chunks) {
    return [doc];
  }
  return chunks.map(chunk => ({ ...baseDoc, [chunkField]: chunk }));
};

function stripURLs(str) {
  return str
    .split(/\s/)
    .filter(subStr => !_.isEmpty(subStr))
    .filter(subStr => !isURL(subStr))
    .join(' ');
}

function fixEntities(str) {
  let newStr = str.slice(0);
  function entitiesFixer(match) {
    const tmpArr = match.split('');
    const fixed =
      tmpArr.slice(0, -1).join('') + ';'.concat(tmpArr[tmpArr.length - 1]);
    newStr = newStr.split(match).join(fixed);
  }
  str.replace(/&#\d\d[^(!?;)]/g, entitiesFixer);
  return newStr;
}

exports.stripURLs = stripURLs;

exports.stripHTML = function stripHTML(text) {
  const unescapedStr = entities.decode(fixEntities(text));
  return stripTags(unescapedStr);
};
