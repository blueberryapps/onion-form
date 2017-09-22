/* eslint-disable react/no-multi-comp */

import connectSubmit from '../src/connectSubmit';
import Form from '../src/Form.react';
import React from 'react';
import reducer from '../src/reducer';
import Button from '../src/Button.react';
import TestUtils from 'react-addons-test-utils';
import { createStore } from 'redux';
import { jsdom } from 'jsdom';
import { Provider as ReduxProvider } from 'react-redux';

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

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

const OnionSubmit = connectSubmit(Button);

describe('connectSubmit()', () => {
  function createSubmit(customProps = {}) {
    const container = TestUtils.renderIntoDocument(
      <ReduxProvider store={store}>
        <Form name="fooForm">
          <OnionSubmit {...customProps}>Send</OnionSubmit>
        </Form>
      </ReduxProvider>
    );

    return TestUtils.findRenderedComponentWithType(container, Button);
  }

  const submit = createSubmit({});

  it('should have children prop', () => {
    expect(submit.props.children).toBe('Send');
  });

  it('should have onClick in prop', () => {
    expect(typeof submit.props.onClick).toBe('function');
  });

  it('should have disabled in prop', () => {
    expect(submit.props.disabled).toBe(false);
  });

  it('should have valid in prop', () => {
    expect(submit.props.valid).toBe(true);
  });

  it('should override disabled in prop by customProp', () => {
    expect(createSubmit({ disabled: true }).props.disabled).toBe(true);
  });
});
