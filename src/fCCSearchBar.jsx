import React from 'react';

import Results from './components/Results.jsx';
import SearchBar from './components/SearchBar.jsx';
import SearchButton from './components/SearchButton.jsx';

import * as styles from './styles';

const { wrapper, appWrap } = styles;

export default class fCCSearchBar extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      searchTerm: '',
      results: []
    };

    this.updateResults = this.updateResults.bind(this);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
  }

  updateResults(newResults) {
    this.setState({ results: newResults });
  }

  updateSearchTerm(value) {
    this.setState({ searchTerm: value });
  }

  render() {
    const { searchTerm, results } = this.state;
    return (
      <div style={ appWrap }>
        <div className='fcc-search' style={ wrapper } { ...this.props }>
          <SearchBar
            searchTerm={ searchTerm }
            updateSearchTerm={ this.updateSearchTerm }
          />
          <SearchButton
            searchTerm={ searchTerm }
            updateResults={ this.updateResults }
          />
        </div>
        <Results results={ results } />
      </div>
    );
  }
}
