import React from 'react';
import PropTypes from 'prop-types';

import socket from '../websocket';

const propTypes = {
  searchTerm: PropTypes.string,
  updateResults: PropTypes.func.isRequired
};

socket.on('connection', () => {
  console.info('connected to elasticsearch!');
});

export default class SearchButton extends React.PureComponent {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const {
      searchTerm,
      updateResults
    } = this.props;
    socket.emit(
      'search-for-this',
      JSON.stringify({ text: searchTerm }),
      (response) => {
        updateResults(response);
      }
    );
  }

  render() {
    return (
      <button onClick={ this.handleClick }>Search</button>
      );
  }
}

SearchButton.displayName = 'SearchButton';
SearchButton.propTypes = propTypes;
