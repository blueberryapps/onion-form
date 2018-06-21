/* eslint-disable react/no-multi-comp */
import { mount } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { TextField, CheckBox } from './mocks';

import connectField from '../src/connectField';
import connectSubmit from '../src/connectSubmit';
import Form from '../src/Form.react';
import reducer from '../src/reducer';
import Button from '../src/Button.react';

const isRequired = value => ((value && `${value}`.length > 0) ? null : 'required');

const Name = connectField('name', { customOverrideProp: 'Overriden props' })(TextField);
const Accept = connectField('accept', { customOverrideProp: 'Overriden props' })(CheckBox);

const OnionSubmit = connectSubmit(Button);

describe('Integration', () => {
  function createSubmit(fooForm = {}, validations = {}) {
    const store = createStore((state = { onionForm: { fields: { fooForm } } }, action) => ({ onionForm: reducer(state.onionForm, action) }));

    const wrapper = mount(
      <ReduxProvider store={store}>
        <Form name="fooForm">
          <Name validations={validations.name} />
          <Accept validations={validations.accept} />
          <OnionSubmit>Send</OnionSubmit>
        </Form>
      </ReduxProvider>
    );

    return wrapper.find(Button);
  }

  it('should have valid true when no validations', () => {
    const submit = createSubmit();
    expect(submit.prop('valid')).toBe(true);
  });

  it('should have valid true when all fields are valid (one field)', () => {
    const submit = createSubmit({ name: { value: 'John' } }, { name: [isRequired] });
    expect(submit.prop('valid')).toBe(true);
  });

  it('should have valid true when all fields are valid (two fields)', () => {
    const submit = createSubmit({ name: { value: 'John' }, accept: { value: true } }, { name: [isRequired], accept: [isRequired] });
    expect(submit.prop('valid')).toBe(true);
  });

  it('should have valid false when all fields are not valid (invalid value)', () => {
    const submit = createSubmit({ name: { value: 'John' }, accept: { value: false } }, { name: [isRequired], accept: [isRequired] });
    expect(submit.prop('valid')).toBe(false);
  });

  it('should have valid false when all fields are not valid (missing value in state)', () => {
    const submit = createSubmit({ name: { value: '' } }, { name: [isRequired], accept: [isRequired] });
    expect(submit.prop('valid')).toBe(false);
  });

  it('should have valid false when all fields are not valid (missing all values)', () => {
    const submit = createSubmit({}, { name: [isRequired], accept: [isRequired] });
    expect(submit.prop('valid')).toBe(false);
  });
});
