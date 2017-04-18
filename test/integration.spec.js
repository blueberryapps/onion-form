/* eslint-disable react/no-multi-comp */

import connectField from '../src/connectField';
import connectSubmit from '../src/connectSubmit';
import Form from '../src/Form.react';
import React from 'react';
import reducer from '../src/reducer';
import Button from '../src/Button.react';
import TestUtils from 'react-addons-test-utils';
import { assert } from 'chai';
import { createStore } from 'redux';
import { jsdom } from 'jsdom';
import { Provider as ReduxProvider } from 'react-redux';
import { TextField, CheckBox } from './mocks';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

const isRequired = (value) => ((!value) ? 'required' : null);

const Name = connectField('name', { customOverrideProp: 'Overriden props' })(TextField);
const Accept = connectField('accept', { customOverrideProp: 'Overriden props' })(CheckBox);

const OnionSubmit = connectSubmit(Button);

describe('connectSubmit()', () => {
  function createSubmit(fooForm = {}, validations = {}) {
    const store = createStore(() => ({ onionForm: reducer({ fields: { fooForm } }) }));
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

  it('should have isValid true when no validations', () => {
    const submit = createSubmit();
    assert.isTrue(submit.props.isValid);
  });

  it('should have isValid true when all fields are valid', () => {
    const submit = createSubmit({name: {value: 'John'}}, { name: [isRequired] });
    assert.isTrue(submit.props.isValid);
  });

  it('should have isValid true when all fields are valid', () => {
    const submit = createSubmit({name: {value: 'John'}, accept: {value: true}}, { name: [isRequired], accept: [isRequired] });
    assert.isTrue(submit.props.isValid);
  });

  it('should have isValid false when all fields are not valid', () => {
    const submit = createSubmit({name: {value: 'John'}, accept: {value: false}}, { name: [isRequired], accept: [isRequired] });
    assert.isFalse(submit.props.isValid);
  });

  it('should have isValid false when all fields are not valid', () => {
    const submit = createSubmit({accept: {value: false}}, { name: [isRequired], accept: [isRequired] });
    assert.isFalse(submit.props.isValid);
  });

  it('should have isValid false when all fields are not valid', () => {
    const submit = createSubmit({}, { name: [isRequired], accept: [isRequired] });
    assert.isFalse(submit.props.isValid);
  });
});
