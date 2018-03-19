import React from 'react';
import ReactDOM from 'react-dom';
import FCCSearchBar from '../src/index.js';
import { Grid, Row, Col } from 'react-bootstrap';

ReactDOM.render(
  <Grid fluid={true} style={{ background: '#006400' }}>
    <Row>
      <Col md={3} xs={12} />
      <Col md={6} xs={12}>
        <FCCSearchBar />
      </Col>
      <Col md={3} xs={0} />
    </Row>
  </Grid>,
  document.getElementById('mount-app')
);
