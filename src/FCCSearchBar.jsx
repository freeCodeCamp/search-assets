import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/lib/Button';
import Navbar from 'react-bootstrap/lib/Navbar';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';


import Results from './components/Results.jsx';

// import * as styles from './styles';

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

  updateSearchTerm(e) {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ searchTerm: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const {
      searchTerm
    } = this.state;
    axios.get(`http://freecodecamp.duckdns.org/search?q=${searchTerm}`)
      .then(response => {
        this.updateResults(response.data);
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const { searchTerm, results } = this.state;
    return (
      <div { ...this.props }>
        <form onSubmit={ this.handleSubmit }>
        <Navbar.Form>
          <FormGroup style={{ display: 'flex' }}>
            <FormControl
              onChange={ this.updateSearchTerm }
              style={{ width: '100%' }}
              type='text'
              value={ searchTerm }
            />
            <Button type='submit'>Search</Button>
          </FormGroup>
        </Navbar.Form>
        </form>
        <Results results={ results } />
      </div>
    );
  }
}

export default FCCSearchBar;
