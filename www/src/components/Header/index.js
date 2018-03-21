import React from 'react';
import Link from 'gatsby-link';
import { SearchBox } from 'react-instantsearch/dom';

import SearchHits from './../SearchHits';

import './header.css';

const Header = () => (
  <header>
    <nav>
      <div className="nav-logo">
        <img
          alt="freeCodeCamp logo. Learn to code and help non-profits"
          src="https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg"
        />
      </div>
      <SearchBox
        translations={{
          placeholder: 'Search 8,000+ lessons, articles, and videos',
        }}
      />
    </nav>
  </header>
);

export default Header;
