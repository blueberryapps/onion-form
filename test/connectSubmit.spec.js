/* eslint-disable react/no-multi-comp */
import { mount } from 'enzyme';
import { createStore } from 'redux';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import connectSubmit from '../src/connectSubmit';
import Form from '../src/Form.react';
import reducer from '../src/reducer';
import Button from '../src/Button.react';

const initial = {
  fields: {
    fooForm: {
      firstName: {
        customProperty: 'Hi Hello From State',
        value: 'Bar',
        error: null
      }
    }
  }
};

const store = createStore((state = { onionForm: initial }, action) => ({ onionForm: reducer(state.onionForm, action) }));

const OnionSubmit = connectSubmit(Button);

describe('connectSubmit()', () => {
  function createSubmit(customProps = {}) {
    const wrapper = mount(
      <ReduxProvider store={store}>
        <Form name="fooForm">
          <OnionSubmit {...customProps}>Send</OnionSubmit>
        </Form>
      </ReduxProvider>
    );
    return wrapper.find(Button);
  }

  const submit = createSubmit({});

  it('should have children prop', () => {
    expect(submit.prop('children')).toBe('Send');
  });

  it('should have onClick in prop', () => {
    expect(typeof submit.prop('onClick')).toBe('function');
  });

  it('should have disabled in prop', () => {
    expect(submit.prop('disabled')).toBe(false);
  });

  it('should have valid in prop', () => {
    expect(submit.prop('valid')).toBe(true);
  });

  it('should override disabled in prop by customProp', () => {
    expect(createSubmit({ disabled: true }).prop('disabled')).toBe(true);
  });
});
