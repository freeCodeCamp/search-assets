import React from 'react';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import axios from 'axios';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

import { normaliser } from './resultNormaliser';
import './fcc-search-bar.css';

const requestUrl = 'https://search.freecodecamp.org';

class FCCSearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    let previousSearchTerm = '';
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.handleResults = this.handleResults.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      results: [],
      searchTerm: ''
    };
    this.input = new Subject();
    this.stream$ = merge(
      this.input.pipe(debounceTime(500)),
      this.input.pipe(throttleTime(500), distinctUntilChanged())
    ).subscribe(() => {
      const { searchTerm } = this.state;
      if (
        searchTerm.length > 2 &&
        searchTerm.length !== previousSearchTerm.length
      ) {
        previousSearchTerm = searchTerm.slice(0);
        return this.getSearchResults();
      }
      previousSearchTerm = searchTerm.slice(0);
      return;
    });
  }

  getSearchResults() {
    const { searchTerm } = this.state;
    axios
      .get(`${requestUrl}/search?q=${searchTerm}`)
      .then(response => {
        return response.data;
      })
      .then(data => {
        const results = normaliser(data);
        this.setState(
          state => ({
            ...state,
            results
          }),
          () => this.handleResults()
        );
      })
      .catch(err => {
        console.error(err);
        this.setState(
          state => ({
            ...state,
            results: []
          }),
          () => this.handleResults()
        );
      });
  }

  handleBlur() {
    this.setState(state => ({
      ...state,
      searchTerm: ''
    }));
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState(
      state => ({
        ...state,
        searchTerm: value
      }),
      () => this.input.next()
    );
  }

  handleResults() {
    const { results } = this.state;
    this.props.handleResults(results);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    const { placeholder } = this.props;
    const { searchTerm } = this.state;
    return (
      <div className="fcc_searchBar">
        <form onSubmit={this.handleSubmit} className="fcc_searchForm">
          <ControlLabel htmlFor="fcc_searchInput" srOnly={true}>
            Search
          </ControlLabel>
          <FormControl
            className="fcc_input"
            id="fcc_searchInput"
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            placeholder={placeholder}
            type="text"
            value={searchTerm}
          />
        </form>
      </div>
    );
  }
}

FCCSearchBar.defaultProps = {
  handleResults: () => {
    console.warn(
      'Expected a "handleResults" prop in FCCSearchBar, instead we are using a default fallback'
    );
  },
  placeholder: 'What would you like to know?'
};
FCCSearchBar.displayName = 'FCCSearchBar';

export default FCCSearchBar;
