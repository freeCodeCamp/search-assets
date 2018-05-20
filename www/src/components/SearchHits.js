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

const indexMap = {
  challenges: {
    title: 'Lesson',
    url: 'https://learn.freecodecamp.org'
  },
  guides: {
    title: 'Guide',
    url: 'https://guide.freecodecamp.org'
  },
  youtube: {
    title: 'YouTube',
    url: 'https://www.youtube.com/watch?v='
  }
};

const buildUrl = (index, result) =>
  `${indexMap[index].url}${'videoId' in result ? result.videoId : result.url}`;

const AllHits = connectAutoComplete(({ hits, currentRefinement }) => {
  const isHitsEmpty = hits.every(index => !index.hits.length);

  return currentRefinement && !isHitsEmpty ? (
    <div className="ais-Hits">
      <ul className="ais-Hits-list">
        {hits.map(({ hits: results, index }) =>
          results.map(result => (
            <a
              href={buildUrl(index, result)}
              key={result.objectID}
              target="_blank"
            >
              <li className="ais-Hits-item dataset-node">
                <p>
                  <strong>{indexMap[index].title}:</strong>
                  &nbsp;
                  <Highlight attribute="title" hit={result} />
                </p>
              </li>
            </a>
          ))
        )}
      </ul>
    </div>
  ) : (
    <NoResults query={currentRefinement} />
  );
});

AllHits.displayName = 'AllHits';

const SearchHits = connectStateResults(({ handleClick, searchState }) => {
  const isSearchEmpty = isEmpty(searchState) || !searchState.query;

  return isSearchEmpty ? (
    <EmptySearch />
  ) : (
    <AllHits handleClick={handleClick} />
  );
});

SearchHits.displayName = 'SearchHits';

export default SearchHits;
