import * as actions from './actions';
import { Record, Map } from 'immutable';

export const InitialState = Record({
  fields: new Map(),
  forms: new Map()
});

const initialState = new InitialState;

export const deafultFieldProperties = Map({
  value: '',
  liveValidation: false,
  error: null,
  apiError: null
});

function reviveFields(fields) {
  return Object.keys(fields).reduce(
    (acc, field) => acc.set(field, deafultFieldProperties.merge(fields[field])),
    new Map
  );
}

function revive(state) {
  const fields = (state.fields || {});
  return Object.keys(fields).reduce(
    (acc, form) => acc.setIn(['fields', form], reviveFields(fields[form]))
    , initialState
  );
}

/**
 * Translation Redux reducer
 * @param  {Object} inputState  App state
 * @param  {Object} action      Flux action
 * @return {Object}             Updated app state
 */
export default function translationReducer(inputState = initialState, action = {}) {
  const state = !(inputState instanceof InitialState) ? revive(inputState) : inputState;

  switch (action.type) {
    case actions.REGISTER_ONION_FORM_FIELD: {
      const { form, field } = action;
      if (Map.isMap(state.getIn(['fields', form, field]))) {
        return state;
      }
      return state.setIn(['fields', form, field], deafultFieldProperties);
    }

    case actions.SET_ONION_FORM_FIELD_PROPERTY: {
      const { form, field, property, value } = action;
      return state.setIn(['fields', form, field, property], value);
    }

    case actions.SET_ONION_FORM_MULTIPLE_FIELDS: {
      const { form, property, values } = action;
      return Object.keys(values).reduce(
        (acc, field) => acc.setIn(['fields', form, field, property], values[field]),
        state
      );
    }

    case actions.CLEAR_ONION_FORM: {
      const { form } = action;
      const fields = state.getIn(['fields', form]) || [];
      return fields.reduce(
        (acc, _, field) => acc.setIn(['fields', form, field], deafultFieldProperties),
        state
      );
    }

    case actions.CLEAR_ONION_FORM_PROPERTY: {
      const { form, property } = action;
      const fields = state.getIn(['fields', form]) || [];
      return fields.reduce(
        (acc, _, field) => acc.setIn(['fields', form, field, property], null),
        state
      );
    }
  }

  return state;
}
