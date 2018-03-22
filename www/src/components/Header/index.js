import React, { PureComponent } from 'react';
import { SearchBox } from 'react-instantsearch/dom';
import qs from 'query-string';

import './header.css';

class Header extends PureComponent {
  componentDidMount() {
    const { props: searchBoxProps, refine } = this._SearchBox_;
    const { defaultRefinement } = searchBoxProps;
    return defaultRefinement ? refine(defaultRefinement) : null;
  }

  getQueryFromLocation() {
    if (typeof window === 'undefined') {
      return '';
    }
    const { q: query } = qs.parse(window.location.search);
    return query ? query : '';
  }

  render() {
    return (
      <header>
        <nav>
          <div className="nav-logo">
            <img
              alt="freeCodeCamp logo. Learn to code and help non-profits"
              src="https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg"
            />
          </div>
          <SearchBox
            defaultRefinement={this.getQueryFromLocation()}
            ref={ref => {
              this._SearchBox_ = ref;
            }}
            translations={{
              placeholder: 'Search 8,000+ lessons, articles, and videos'
            }}
          />
        </nav>
      </header>
    );
  }
}

export default Header;
