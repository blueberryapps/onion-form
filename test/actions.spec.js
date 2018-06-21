import createFormActions, * as actions from '../src/actions';

describe('actions', () => {
  it('setMultipleFields()', () => {
    expect(actions.setMultipleFields('registrationForm', 'value', { firstName: 'Foo', lastName: 'Bar' })).toEqual({
      type: actions.SET_ONION_FORM_MULTIPLE_FIELDS,
      form: 'registrationForm',
      property: 'value',
      values: { firstName: 'Foo', lastName: 'Bar' }
    });
  });

  it('setFormFieldProperty()', () => {
    expect(actions.setFormFieldProperty('registrationForm', 'firstName', 'value', 'FooBar')).toEqual({
      type: actions.SET_ONION_FORM_FIELD_PROPERTY,
      form: 'registrationForm',
      field: 'firstName',
      property: 'value',
      value: 'FooBar'
    });
  });

  it('setFieldValue()', () => {
    expect(actions.setFieldValue('registrationForm', 'firstName', 'FooBar')).toEqual({
      type: actions.SET_ONION_FORM_FIELD_PROPERTY,
      form: 'registrationForm',
      field: 'firstName',
      property: 'value',
      value: 'FooBar'
    });
  });

  it('setFieldBlur()', () => {
    expect(actions.setFieldLiveValidation('registrationForm', 'firstName')).toEqual({
      type: actions.SET_ONION_FORM_FIELD_PROPERTY,
      form: 'registrationForm',
      property: 'liveValidation',
      field: 'firstName',
      value: true
    });
  });

  it('setFieldError()', () => {
    expect(actions.setFieldError('registrationForm', 'firstName', 'something strange')).toEqual({
      type: actions.SET_ONION_FORM_FIELD_PROPERTY,
      form: 'registrationForm',
      property: 'error',
      field: 'firstName',
      value: 'something strange'
    });
  });

  it('setFieldApiError()', () => {
    expect(actions.setFieldApiError('registrationForm', 'firstName', 'something strange')).toEqual({
      type: actions.SET_ONION_FORM_FIELD_PROPERTY,
      form: 'registrationForm',
      property: 'apiError',
      field: 'firstName',
      value: 'something strange'
    });
  });

  it('clearFormProperties()', () => {
    expect(actions.clearFormProperty('registrationForm', 'value')).toEqual({
      type: actions.CLEAR_ONION_FORM_PROPERTY,
      form: 'registrationForm',
      property: 'value'
    });
  });

  it('clearForm()', () => {
    expect(actions.clearForm('registrationForm')).toEqual({
      type: actions.CLEAR_ONION_FORM,
      form: 'registrationForm',
    });
  });

  it('createFormActions()', () => {
    const formActions = createFormActions('registrationForm');
    expect(formActions.clearFormProperty('value')).toEqual({
      type: actions.CLEAR_ONION_FORM_PROPERTY,
      form: 'registrationForm',
      property: 'value'
    });
  });
});
