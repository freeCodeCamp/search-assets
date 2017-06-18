import React from 'react';

import Results from './components/Results.jsx';
import SearchBar from './components/SearchBar.jsx';
import SearchButton from './components/SearchButton.jsx';

import socket from './websocket';
import * as styles from './styles';

const { wrapper, appWrap } = styles;

socket.on('connection', () => {
  console.info('connected to elasticsearch!');
});

export default class fCCSearchBar extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      searchTerm: '',
      results: []
    };

    this.updateResults = this.updateResults.bind(this);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateResults(newResults) {
    this.setState({ results: newResults });
  }

  updateSearchTerm(value) {
    this.setState({ searchTerm: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const {
      searchTerm
    } = this.state;
    socket.emit(
      'search-for-this',
      JSON.stringify({ text: searchTerm }),
      (response) => {
        this.updateResults(response);
      }
    );
  }

  render() {
    const { searchTerm, results } = this.state;
    return (
      <div style={ appWrap } { ...this.props }>
        <form
          className='fcc-search-form'
          onSubmit={ this.handleSubmit }
          style={ wrapper }
          >
          <SearchBar
            searchTerm={ searchTerm }
            updateSearchTerm={ this.updateSearchTerm }
          />
          <SearchButton />
        </form>
        <Results results={ results } />
      </div>
    );
  }
}
