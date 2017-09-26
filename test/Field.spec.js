/* eslint-disable react/no-multi-comp */

import Field, { BasicInput } from '../src/Field.react';
import Form from '../src/Form.react';
import React from 'react';
import reducer from '../src/reducer';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { mount } from 'enzyme';

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

describe('Field', () => {
  function createStub(customProps = {}, Input) {
    const wrapper = mount(
      <ReduxProvider store={store}>
        <Form name="fooForm">
          <Field name="firstName" {...customProps} />
        </Form>
      </ReduxProvider>
    );
    return wrapper.find(Input);
  }

  const stub = createStub({}, BasicInput);

  it('input should have name prop', () => {
    expect(stub.prop('name')).toBe('firstName');
  });

  it('input should have onChange prop', () => {
    expect(typeof stub.prop('onChange')).toBe('function');
  });

  it('input should have value prop', () => {
    expect(stub.prop('value')).toBe('Bar');
  });

  it('input should have error prop', () => {
    expect(stub.prop('error')).toBe('isRequired');
  });

  it('input should have customProperty prop', () => {
    expect(stub.prop('customProperty')).toBe('Hi Hello From State');
  });

  describe('with custom Component', () => {
    const FooInput = () => (<div className="FooInput" />);

    it('should render it', () => {
      const wrapperFoo = mount(
        <ReduxProvider store={store}>
          <Form name="fooForm">
            <Field name="firstName" component={FooInput} />
            <FooInput />
          </Form>
        </ReduxProvider>
      );
      expect(wrapperFoo).toMatchSnapshot();
    });
  });
});
