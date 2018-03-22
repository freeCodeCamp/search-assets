import React, { PureComponent } from 'react';
import './header.css';

function Header() {
  return (
    <header>
      <nav>
        <div className="nav-logo">
          <img
            alt="freeCodeCamp logo. Learn to code and help non-profits"
            src="https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg"
          />
        </div>
        {this.props.children}
      </nav>
    </header>
  );
}

export default Header;
