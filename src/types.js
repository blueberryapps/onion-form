/* @flow */

export type ValueType = any;

export type PropertyType =
  | 'apiError'
  | 'error'
  | 'liveValidation'
  | 'value';

// Actions

export type ActionType =
  | { type: 'CLEAR_ONION_FORM', form: string }
  | { type: 'CLEAR_ONION_FORM_PROPERTY', form: string, property: PropertyType }
  | { type: 'REGISTER_ONION_FORM_FIELD', form: string, field: string }
  | { type: 'SET_ONION_FORM_FIELD_PROPERTY', form: string, field: string, property: PropertyType, value: ValueType }
  | { type: 'SET_ONION_FORM_MULTIPLE_FIELDS', form: string, property: PropertyType, values: Array<ValueType> };
