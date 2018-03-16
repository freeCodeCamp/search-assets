const algoliasearch = require('algoliasearch');

const { ALGOLIA_ADMIN_KEY, ALGOLIA_APP_ID } = process.env;

exports.client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
