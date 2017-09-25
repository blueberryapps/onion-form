/* @flow */
import type { ActionType, PropertyType, ValueType, ValuesType } from './types';

export const SET_ONION_FORM_FIELD_PROPERTY = 'SET_ONION_FORM_FIELD_PROPERTY';
export const SET_ONION_FORM_MULTIPLE_FIELDS = 'SET_ONION_FORM_MULTIPLE_FIELDS';
export const REGISTER_ONION_FORM_FIELD = 'REGISTER_ONION_FORM_FIELD';
export const CLEAR_ONION_FORM_PROPERTY = 'CLEAR_ONION_FORM_PROPERTY';
export const CLEAR_ONION_FORM = 'CLEAR_ONION_FORM';

export function registerField(form: string, field: string): ActionType {
  return {
    type: 'REGISTER_ONION_FORM_FIELD',
    form,
    field,
  };
}

export function setMultipleFields(form: string, property: PropertyType, values: ValuesType): ActionType {
  return {
    type: 'SET_ONION_FORM_MULTIPLE_FIELDS',
    form,
    property,
    values,
  };
}

export function setFormFieldProperty(form: string, field: string, property: PropertyType, value: ValueType): ActionType {
  return {
    type: 'SET_ONION_FORM_FIELD_PROPERTY',
    form,
    field,
    property,
    value
  };
}

export function clearForm(form: string): ActionType {
  return {
    type: 'CLEAR_ONION_FORM',
    form
  };
}

export function clearFormProperty(form: string, property: PropertyType): ActionType {
  return {
    type: 'CLEAR_ONION_FORM_PROPERTY',
    form,
    property
  };
}

export function setFieldValue(form: string, field: string, value: ValueType): ActionType {
  return setFormFieldProperty(form, field, 'value', value);
}

export function setFieldLiveValidation(form: string, field: string): ActionType {
  return setFormFieldProperty(form, field, 'liveValidation', true);
}

export function setFieldError(form: string, field: string, error: ValueType): ActionType {
  return setFormFieldProperty(form, field, 'error', error);
}

export function setFieldApiError(form: string, field: string, error: ValueType): ActionType {
  return setFormFieldProperty(form, field, 'apiError', error);
}

export default function createFormActions(form: string) {
  return {
    clearForm: clearForm.bind(null, form),
    clearFormProperty: clearFormProperty.bind(null, form),
    registerField: registerField.bind(null, form),
    setFieldApiError: setFieldApiError.bind(null, form),
    setFieldLiveValidation: setFieldLiveValidation.bind(null, form),
    setFieldError: setFieldError.bind(null, form),
    setFieldValue: setFieldValue.bind(null, form),
    setFormFieldProperty: setFormFieldProperty.bind(null, form),
    setMultipleFields: setMultipleFields.bind(null, form)
  };
}
