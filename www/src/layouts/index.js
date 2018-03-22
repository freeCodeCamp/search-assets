/* global graphql */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { InstantSearch, Index, Configure } from 'react-instantsearch/dom';
import qs from 'query-string';

import Header from '../components/Header';
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
    const { title, description } = data.site.siteMetadata;

    return (
      <Fragment>
        <Helmet
          meta={[
            { name: 'description', content: description },
            { name: 'keywords', content: 'sample, something' }
          ]}
          title={title}
        />

        <InstantSearch
          apiKey="4318af87aa3ce128708f1153556c6108"
          appId="QMJYL5WYTI"
          indexName="challenges"
          searchState={searchState}
          onSearchStateChange={this.onSearchStateChange}
        >
          <Header />
          <Index indexName="guides" />
          <Index indexName="youtube" />
          <Configure hitsPerPage={8} />
          <main>{children()}</main>
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
      }
    }
  }
`;
