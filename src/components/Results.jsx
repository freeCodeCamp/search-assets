import React from 'react';
import PropTypes from 'prop-types';

import * as styles from '../styles';

const propTypes = {
  results: PropTypes.arrayOf(PropTypes.object)
};

const { resultUl } = styles;

function renderListItems(results) {
  return results.map((result, i) => {
    const { title, url } = result._source;
    return (
      <li key={ i }>
        <h4><a href={ url }>{ title }</a></h4>
      </li>
    );
  });
}

function Results(props) {
  const { results = [] } = props;
  if (!results.length) {
    return null;
  }
  console.log('results', results);
  return (
    <ul className='dropdown-menu' style={ resultUl }>
      { renderListItems(results) }
    </ul>
  );
}

Results.displayName = 'Results';
Results.propTypes = propTypes;

export default Results;
