import * as actions from '../src/actions';
import createFormActions from '../src/actions';
import { assert } from 'chai';

describe('actions', () => {
  it('setMultipleFields()', () => {
    assert.deepEqual(
      actions.setMultipleFields('registrationForm', 'value', { firstName: 'Foo', lastName: 'Bar' }),
      {
        type: actions.SET_ONION_FORM_MULTIPLE_FIELDS,
        form: 'registrationForm',
        property: 'value',
        values: { firstName: 'Foo', lastName: 'Bar' }
      }
    );
  });

  it('setFormFieldProperty()', () => {
    assert.deepEqual(
      actions.setFormFieldProperty('registrationForm', 'firstName', 'value', 'FooBar'),
      {
        type: actions.SET_ONION_FORM_FIELD_PROPERTY,
        form: 'registrationForm',
        field: 'firstName',
        property: 'value',
        value: 'FooBar'
      }
    );
  });

  it('setFieldValue()', () => {
    assert.deepEqual(
      actions.setFieldValue('registrationForm', 'firstName', 'FooBar'),
      {
        type: actions.SET_ONION_FORM_FIELD_PROPERTY,
        form: 'registrationForm',
        field: 'firstName',
        property: 'value',
        value: 'FooBar'
      }
    );
  });

  it('setFieldBlur()', () => {
    assert.deepEqual(
      actions.setFieldLiveValidation('registrationForm', 'firstName'),
      {
        type: actions.SET_ONION_FORM_FIELD_PROPERTY,
        form: 'registrationForm',
        property: 'liveValidation',
        field: 'firstName',
        value: true
      }
    );
  });

  it('setFieldError()', () => {
    assert.deepEqual(
      actions.setFieldError('registrationForm', 'firstName', 'something strange'),
      {
        type: actions.SET_ONION_FORM_FIELD_PROPERTY,
        form: 'registrationForm',
        property: 'error',
        field: 'firstName',
        value: 'something strange'
      }
    );
  });

  it('setFieldApiError()', () => {
    assert.deepEqual(
      actions.setFieldApiError('registrationForm', 'firstName', 'something strange'),
      {
        type: actions.SET_ONION_FORM_FIELD_PROPERTY,
        form: 'registrationForm',
        property: 'apiError',
        field: 'firstName',
        value: 'something strange'
      }
    );
  });

  it('clearFormProperties()', () => {
    assert.deepEqual(
      actions.clearFormProperty('registrationForm', 'value'),
      {
        type: actions.CLEAR_ONION_FORM_PROPERTY,
        form: 'registrationForm',
        property: 'value'
      }
    );
  });

  it('clearForm()', () => {
    assert.deepEqual(
      actions.clearForm('registrationForm'),
      {
        type: actions.CLEAR_ONION_FORM,
        form: 'registrationForm',
      }
    );
  });

  it('createFormActions()', () => {
    const formActions = createFormActions('registrationForm');
    assert.deepEqual(
      formActions.clearFormProperty('value'),
      {
        type: actions.CLEAR_ONION_FORM_PROPERTY,
        form: 'registrationForm',
        property: 'value'
      }
    );
  });
});
