import React from 'react';
import PropTypes from 'prop-types';
import { Highlight } from 'react-instantsearch/dom';

const Suggestion = ({ handleSubmit, hit }) => (
  <div className='fcc_suggestion_item' onClickCapture={handleSubmit}>
    <span className='hit-name'>
      {hit.objectID.includes('default-hit-') ? (
        <Highlight attribute='query' hit={hit} tagName='strong' />
      ) : (
        <Highlight attribute='query' hit={hit} />
      )}
    </span>
  </div>
);

Suggestion.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  hit: PropTypes.object
};

export default Suggestion;
