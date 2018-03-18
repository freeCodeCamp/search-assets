const { client } = require('../algolia');
const fs = require('fs-extra');

const index = client.initIndex('guides');

const browseAll = index.browseAll();
let hits = [];

browseAll.on('result', function onResult(content) {
  hits = hits.concat(content.hits);
});

browseAll.on('end', function onEnd() {
  console.log('Finished!');
  console.log('We got %d hits', hits.length);
  fs.writeFile('./browse.json', JSON.stringify(hits, null, 2));
});

browseAll.on('error', function onError(err) {
  throw err;
});
