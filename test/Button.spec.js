/* eslint-disable react/no-multi-comp */

import React from 'react';
import Button from '../src/Button.react';
import { shallow } from 'enzyme';

describe('Button', () => {
  const wrapper = shallow(<Button disabled onClick={() => {}}>Send</Button>);

  it('should have children prop', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should have onClick in prop', () => {
    expect(typeof wrapper.prop('onClick')).toBe('function');
  });

  it('should have disabled in prop', () => {
    expect(wrapper.prop('disabled')).toBe(true);
  });
});
