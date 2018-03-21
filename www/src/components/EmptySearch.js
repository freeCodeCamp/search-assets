import React from 'react';
import PropTypes from 'prop-types';

import './empty-search.css';
import fireSVG from '../../static/img/fire.svg';

const propTypes = {};

function EmptySearch(props) {
  return (
    <div className="empty-search-wrapper">
      <img alt="" src={fireSVG} />
    </div>
  );
}

EmptySearch.displayName = 'EmptySearch';
EmptySearch.propTypes = propTypes;

export default EmptySearch;
