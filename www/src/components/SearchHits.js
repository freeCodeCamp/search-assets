import React from 'react';
import {
  connectStateResults,
  connectAutoComplete
} from 'react-instantsearch/connectors';
import { Highlight } from 'react-instantsearch/dom';
import isEmpty from 'lodash/isEmpty';

import EmptySearch from './EmptySearch';
import NoResults from './NoResults';

import './hits.css';

const blockTitleMap = {
  challenges: 'Lessons',
  guides: 'Guide',
  youtube: 'YouTube'
};

const AllHits = connectAutoComplete(
  ({ hits, handleClick }) =>
    hits.length ? (
      <div className="ais-Hits">
        <ul className="ais-Hits-list">
          {hits.map(({ hits: results, index }) =>
            results.map(result => (
              <li
                className="ais-Hits-item dataset-node"
                data-fcc-content-index={index}
                data-fcc-content-url={
                  'videoId' in result ? result.videoId : result.url
                }
                key={result.objectID}
                onClick={handleClick}
              >
                <p>
                  <strong>{blockTitleMap[index]}</strong>
                  &nbsp;
                  <Highlight attribute="title" hit={result} />
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    ) : null
);

AllHits.displayName = 'AllHits';

const SearchHits = connectStateResults(
  ({ handleClick, searchResults, searchState }) => {
    const isSearchEmpty = isEmpty(searchState) || !searchState.query;
    const results = searchResults && searchResults.nbHits !== 0;

    return isSearchEmpty ? (
      <EmptySearch />
    ) : results ? (
      <AllHits handleClick={handleClick} />
    ) : (
      <NoResults query={searchState.query} />
    );
  }
);

SearchHits.displayName = 'SearchHits';

export default SearchHits;
