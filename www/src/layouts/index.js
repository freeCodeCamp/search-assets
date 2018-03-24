/* global graphql */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {
  InstantSearch,
  Index,
  Configure,
  PoweredBy
} from 'react-instantsearch/dom';
import qs from 'query-string';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import './index.css';

const propTypes = {
  children: PropTypes.func,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        description: PropTypes.string,
        title: PropTypes.string
      })
    })
  })
};

class TemplateWrapper extends Component {
  state = {
    searchState: {
      query: this.getInitialStateFromURL()
    }
  };

  onSearchStateChange = searchState =>
    this.setState(() => ({
      searchState
    }));

  getInitialStateFromURL() {
    if (typeof window === 'undefined') {
      return '';
    }

    const { q: query } = qs.parse(window.location.search);

    return query ? query : '';
  }

  render() {
    const { data, children } = this.props;
    const { searchState } = this.state;
    const { title, description, keywords } = data.site.siteMetadata;

    return (
      <Fragment>
        <Helmet
          meta={[
            { name: 'description', content: description },
            { name: 'keywords', content: keywords.join(', ') }
          ]}
          title={title}
        />

        <InstantSearch
          apiKey="4318af87aa3ce128708f1153556c6108"
          appId="QMJYL5WYTI"
          indexName="challenges"
          onSearchStateChange={this.onSearchStateChange}
          searchState={searchState}
        >
          <Header>
            <SearchBar />
          </Header>
          <Index indexName="guides" />
          <Index indexName="youtube" />
          <Configure hitsPerPage={8} />
          <main>{children()}</main>
          <footer>
            <PoweredBy />
          </footer>
        </InstantSearch>
      </Fragment>
    );
  }
}

TemplateWrapper.propTypes = propTypes;

export default TemplateWrapper;

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        description
        keywords
      }
    }
  }
`;
