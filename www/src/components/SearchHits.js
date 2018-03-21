import React from 'react';
import {
  connectStateResults,
  connectAutoComplete
} from 'react-instantsearch/connectors';
import isEmpty from 'lodash/isEmpty';

import { makeResult } from './Result';
import EmptySearch from './EmptySearch';
import NoResults from './NoResults';

import './hits.css';

const attributes = {
  challenges: ['title', 'description'],
  guides: ['title', 'content'],
  youtube: ['title', 'description']
};

const ChallengeHit = makeResult(...attributes.challenges);
ChallengeHit.displayName = 'ChallengeHit';

const GuidesHit = makeResult(...attributes.guides);
GuidesHit.displayName = 'GuidesHit';

const YoutubeHit = makeResult(...attributes.youtube);
YoutubeHit.displayName = 'YoutubeHit';

const hitCompMap = {
  challenges: ChallengeHit,
  guides: GuidesHit,
  youtube: YoutubeHit
};

const blockTitleMap = {
  challenges: 'Lessons',
  guides: 'Guide',
  youtube: 'YouTube'
};

const AllHits = connectAutoComplete(
  ({ hits, handleSubmit }) =>
    hits.length ? (
      <div className="ais-Hits">
        {hits.map(({ hits: results, index }) => {
          const HitComponent = hitCompMap[index];
          return (
            <div className="hits-block-wrapper" key={index}>
              <div className="hits-block-title">
                <h4>{blockTitleMap[index]}</h4>
              </div>
              <ul className="ais-Hits-list">
                {results.map(result => (
                  <li
                    className="ais-Hits-item"
                    data-fccobjectid={result.objectID}
                    key={result.objectID}
                  >
                    <HitComponent handleSubmit={handleSubmit} hit={result} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    ) : null
);

AllHits.displayName = 'AllHits';

const SearchHits = connectStateResults(
  ({ handleSubmit, searchResults, searchState }) => {
    const isSearchEmpty = isEmpty(searchState) || !searchState.query;
    const results = searchResults && searchResults.nbHits !== 0;

    return isSearchEmpty ? (
      <EmptySearch />
    ) : results ? (
      <AllHits handleSubmit={handleSubmit} />
    ) : (
      <NoResults query={searchState.query} />
    );
  }
);

SearchHits.displayName = 'SearchHits';

export default SearchHits;
