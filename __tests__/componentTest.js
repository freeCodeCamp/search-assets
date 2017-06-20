import React from 'react';
import { render } from 'enzyme';
import {expect} from 'chai';

import FCCSearchBar from '../dist';

describe('<FCCSearchBar />', () => {

  const wrapper = render(<FCCSearchBar />);

  it('should have a form element', () => {
    expect(wrapper.find('form')).to.have.length(1);
  });

  it('should have an input element', () => {
    expect(wrapper.find('input')).to.have.length(1);
  });

  it('should have a button element', () => {
    expect(wrapper.find('button')).to.have.length(1);
  });

});
