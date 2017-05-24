/* eslint-disable react/no-multi-comp */

import Field, { BasicInput } from '../src/Field.react';
import Form from '../src/Form.react';
import React from 'react';
import reducer from '../src/reducer';
import TestUtils from 'react-addons-test-utils';
import { assert } from 'chai';
import { createStore } from 'redux';
import { jsdom } from 'jsdom';
import { Provider as ReduxProvider } from 'react-redux';

const initial = {
  fields: {
    fooForm: {
      firstName: {
        customProperty: 'Hi Hello From State',
        value: 'Bar',
        error: 'isRequired'
      }
    }
  }
};

const store = createStore(() => ({ onionForm: reducer(initial, {}) }));

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

describe('Field', () => {
  function createStub(customProps = {}, Input) {
    const container = TestUtils.renderIntoDocument(
      <ReduxProvider store={store}>
        <Form name="fooForm">
          <Field name="firstName" {...customProps} />
        </Form>
      </ReduxProvider>
    );

    return TestUtils.findRenderedComponentWithType(container, Input);
  }

  const stub = createStub({}, BasicInput);

  it('input should have name prop', () => {
    assert.equal(stub.props.name, 'firstName');
  });

  it('input should have onChange prop', () => {
    assert.typeOf(stub.props.onChange, 'function');
  });

  it('input should have value prop', () => {
    assert.equal(stub.props.value, 'Bar');
  });

  it('input should have error prop', () => {
    assert.equal(stub.props.error, 'isRequired');
  });

  it('input should have customProperty prop', () => {
    assert.equal(stub.props.customProperty, 'Hi Hello From State');
  });

  describe('with custom Component', () => {
    const FooInput = () => (<div className="FooInput" />);

    it('should render it', () => {
      const fooContainer = TestUtils.renderIntoDocument(
        <ReduxProvider store={store}>
          <Form name="fooForm">
            <Field name="firstName" component={FooInput} />
            <FooInput />
          </Form>
        </ReduxProvider>
      );

      TestUtils.scryRenderedDOMComponentsWithClass(fooContainer, 'FooInput');
    });
  });
});
