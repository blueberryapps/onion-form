export const SET_ONION_FORM_FIELD_PROPERTY = 'SET_ONION_FORM_FIELD_PROPERTY';
export const SET_ONION_FORM_MULTIPLE_FIELDS = 'SET_ONION_FORM_MULTIPLE_FIELDS';
export const CLEAR_ONION_FORM_PROPERTY = 'CLEAR_ONION_FORM_PROPERTY';

export function setMultipleFields(form, property, values) {
  return {
    type: SET_ONION_FORM_MULTIPLE_FIELDS,
    form,
    property,
    values
  };
}

export function setFormFieldProperty(form, field, property, value) {
  return {
    type: SET_ONION_FORM_FIELD_PROPERTY,
    form,
    field,
    property,
    value
  };
}

export function clearFormProperty(form, property) {
  return {
    type: CLEAR_ONION_FORM_PROPERTY,
    form,
    property
  };
}

export function setFieldValue(form, field, value) {
  return setFormFieldProperty(form, field, 'value', value);
}

export function setFieldLiveValidation(form, field) {
  return setFormFieldProperty(form, field, 'liveValidation', true);
}

export function setFieldError(form, field, error) {
  return setFormFieldProperty(form, field, 'error', error);
}

export function setFieldApiError(form, field, error) {
  return setFormFieldProperty(form, field, 'apiError', error);
}

export default function createFormActions(form) {
  return {
    clearFormProperty: clearFormProperty.bind(null, form),
    setFieldApiError: setFieldApiError.bind(null, form),
    setFieldLiveValidation: setFieldLiveValidation.bind(null, form),
    setFieldError: setFieldError.bind(null, form),
    setFieldValue: setFieldValue.bind(null, form),
    setFormFieldProperty: setFormFieldProperty.bind(null, form),
    setMultipleFields: setMultipleFields.bind(null, form)
  };
}
