/* eslint-disable react/no-multi-comp */

import Field, { BasicInput } from '../src/Field.react';
import Form from '../src/Form.react';
import React from 'react';
import reducer from '../src/reducer';
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
        error: 'isRequired'
      }
    }
  }
};

const store = createStore(() => ({ onionForm: reducer(initial) }));

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
    expect(stub.props.name).toBe('firstName');
  });

  it('input should have onChange prop', () => {
    expect(typeof stub.props.onChange).toBe('function');
  });

  it('input should have value prop', () => {
    expect(stub.props.value).toBe('Bar');
  });

  it('input should have error prop', () => {
    expect(stub.props.error).toBe('isRequired');
  });

  it('input should have customProperty prop', () => {
    expect(stub.props.customProperty).toBe('Hi Hello From State');
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
