/* eslint-disable react/no-multi-comp */

import connectField from '../src/connectField';
import connectSubmit from '../src/connectSubmit';
import Form from '../src/Form.react';
import React from 'react';
import reducer from '../src/reducer';
import Button from '../src/Button.react';
import TestUtils from 'react-addons-test-utils';
import { createStore } from 'redux';
import { jsdom } from 'jsdom';
import { Provider as ReduxProvider } from 'react-redux';
import { TextField, CheckBox } from './mocks';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

const isRequired = (value) => ((value && `${value}`.length > 0) ? null : 'required');

const Name = connectField('name', { customOverrideProp: 'Overriden props' })(TextField);
const Accept = connectField('accept', { customOverrideProp: 'Overriden props' })(CheckBox);

const OnionSubmit = connectSubmit(Button);

describe('Integration', () => {
  function createSubmit(fooForm = {}, validations = {}) {
    const store = createStore((state = { onionForm: { fields: { fooForm } } }, action) => ({ onionForm: reducer(state.onionForm, action) }));

    const container = TestUtils.renderIntoDocument(
      <ReduxProvider store={store}>
        <Form name="fooForm">
          <Name validations={validations.name} />
          <Accept validations={validations.accept} />
          <OnionSubmit>Send</OnionSubmit>
        </Form>
      </ReduxProvider>
    );

    return TestUtils.findRenderedComponentWithType(container, Button);
  }

  it('should have valid true when no validations', () => {
    const submit = createSubmit();
    expect(submit.props.valid).toBe(true);
  });

  it('should have valid true when all fields are valid (one field)', () => {
    const submit = createSubmit({ name: { value: 'John' } }, { name: [isRequired] });
    expect(submit.props.valid).toBe(true);
  });

  it('should have valid true when all fields are valid (two fields)', () => {
    const submit = createSubmit({ name: { value: 'John' }, accept: { value: true } }, { name: [isRequired], accept: [isRequired] });
    expect(submit.props.valid).toBe(true);
  });

  it('should have valid false when all fields are not valid (invalid value)', () => {
    const submit = createSubmit({ name: { value: 'John' }, accept: { value: false } }, { name: [isRequired], accept: [isRequired] });
    expect(submit.props.valid).toBe(false);
  });

  it('should have valid false when all fields are not valid (missing value in state)', () => {
    const submit = createSubmit({ name: { value: '' } }, { name: [isRequired], accept: [isRequired] });
    expect(submit.props.valid).toBe(false);
  });

  it('should have valid false when all fields are not valid (missing all values)', () => {
    const submit = createSubmit({}, { name: [isRequired], accept: [isRequired] });
    expect(submit.props.valid).toBe(false);
  });
});
