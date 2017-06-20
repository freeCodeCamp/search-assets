import React from 'react';
import axios from 'axios';

import Results from './components/Results.jsx';
import Input from './components/Input.jsx';

import socket from './websocket';
import * as styles from './styles';

const { wrapper, appWrap } = styles;

class FCCSearchBar extends React.PureComponent {
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
    if (socket) {
      socket.emit(
        'search-for-this',
        JSON.stringify({ text: searchTerm }),
        (response) => {
          this.updateResults(response);
        }
      );
    } else {
      axios.get('http://freecodecamp.duckdns.org/search?q=' + searchTerm)
        .then(response => {
          this.updateResults(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
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
          <Input
            searchTerm={ searchTerm }
            updateSearchTerm={ this.updateSearchTerm }
          />
          <button type='submit'>Search</button>
        </form>
        <Results results={ results } />
      </div>
    );
  }
}

export default FCCSearchBar;
