import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { InstantSearch, Index, Configure } from 'react-instantsearch/dom';

import Header from '../components/Header';
import './index.css';

const TemplateWrapper = ({ children, data }) => {
  const { title, description } = data.site.siteMetadata;
  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[
          { name: 'description', content: description },
          { name: 'keywords', content: 'sample, something' },
        ]}
      />
      <InstantSearch
        apiKey="4318af87aa3ce128708f1153556c6108"
        appId="QMJYL5WYTI"
        indexName="challenges"
      >
        <Header />
        <Index indexName="guides" />
        <Index indexName="youtube" />
        <Configure hitsPerPage={8} />
        <main>{children()}</main>
      </InstantSearch>
    </Fragment>
  );
};

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

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
