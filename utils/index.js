const { Observable } = require('rxjs');
const fse = require('fs-extra');
const chalk = require('chalk');
const format = require('date-fns/format');
const _ = require('lodash');

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

exports.isAFileRE = isAFileRE;
exports.isJSRE = isJSRE;
exports.shouldBeIgnoredRE = shouldBeIgnoredRE;
exports.excludedDirs = excludedDirs;

exports.readDir = function readDir(dir = __dirname, returnFiles = false) {
  const dirContent = fse
    .readdirSync(dir)
    .filter(dir => !excludedDirs.includes(dir))
    .filter(file => !(shouldBeIgnoredRE.test(file) || isJSRE.test(file)))
    .filter(file => file !== 'LICENSE.md');
  return returnFiles
    ? dirContent
    : dirContent.filter(item => !isAFileRE.test(item));
};

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

exports.chunkDocument = function chunkDocument(doc, pickFields, chunkField) {
  const baseDoc = _.pick(doc, pickFields);
  const chunks = doc[chunkField].match(/[\w']+(?:[\n\s]+[\S]+){1,100}/g);
  if (!chunks) {
    return [doc];
  }
  return chunks.map(chunk => ({ ...baseDoc, [chunkField]: chunk }));
};
