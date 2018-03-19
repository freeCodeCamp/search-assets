import React from 'react';
import { render } from 'enzyme';
import { expect } from 'chai';

import FCCSearchBar from '../src';

describe('<FCCSearchBar />', () => {
  const wrapper = render(<FCCSearchBar />);

  it('should have a form element', () => {
    expect(wrapper.find('form')).to.have.length(1);
  });

  it('should have an input element', () => {
    expect(wrapper.find('input')).to.have.length(1);
  });

  it('should have a label', () => {
    expect(wrapper.find('label')).to.have.length(1);
  });

  it('should be labeled as "Search"', () => {
    expect(wrapper.find('label').text()).to.equal('Search');
  });

  it('the label should have a class of "fcc_sr_only"', () => {
    expect(wrapper.find('label').hasClass('fcc_sr_only'));
  });
});
