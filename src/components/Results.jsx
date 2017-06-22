import React from 'react';
import PropTypes from 'prop-types';
import stripTags from 'striptags';

import * as styles from '../styles';

const propTypes = {
  results: PropTypes.arrayOf(PropTypes.object)
};

const { resultUl, resultLi } = styles;

function renderListItems(results) {
  return results.map((result, i) => {
    const { title, body = '', description = '', url } = result._source;
    const extract = body ? body.slice(0, 140) : description.slice(0, 140);
    return (
      <li key={ i } style={ resultLi }>
        <h4><a href={ url }>{ title }</a></h4>
        <p>{ stripTags(extract + '...') }</p>
      </li>
    );
  });
}

function Results(props) {
  const { results = [] } = props;
  if (!results.length) {
    return null;
  }
  return (
    <ul style={ resultUl }>
      { renderListItems(results) }
    </ul>
  );
}

Results.displayName = 'Results';
Results.propTypes = propTypes;

export default Results;
