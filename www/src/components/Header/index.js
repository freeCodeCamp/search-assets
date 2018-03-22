import React from 'react';
import PropTypes from 'prop-types';
import './header.css';

const propTypes = {
  children: PropTypes.node
};

function Header({ children }) {
  return (
    <header>
      <nav>
        <div className="nav-logo">
          <img
            alt="freeCodeCamp logo. Learn to code and help non-profits"
            src="https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg"
          />
        </div>
        {children}
      </nav>
    </header>
  );
}

Header.displayName = 'Header';
Header.propTypes = propTypes;

export default Header;
