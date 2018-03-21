import React from 'react';

import './empty-search.css';
import fireSVG from '../../static/img/fire.svg';

function EmptySearch() {
  return (
    <div className="empty-search-wrapper">
      <img alt="" src={fireSVG} />
    </div>
  );
}

EmptySearch.displayName = 'EmptySearch';

export default EmptySearch;
