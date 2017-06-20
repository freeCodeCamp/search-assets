import React from 'react';
import PropTypes from 'prop-types';

import * as styles from '../styles';

const propTypes = {
  searchTerm: PropTypes.string,
  updateSearchTerm: PropTypes.func.isRequired
};

const { input} = styles;

class SearchBar extends React.PureComponent {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.updateSearchTerm(e.target.value);
  }

  render() {
    const { searchTerm } = this.props;
    return (
      <input
        className='fcc-search-input'
        onChange={ this.handleChange }
        placeholder='What would you like to know today?'
        style={ input }
        type='text'
        value={ searchTerm }
      />
    );
  }
}

SearchBar.displayName = 'SearchBar';
SearchBar.propTypes = propTypes;

export default SearchBar;
