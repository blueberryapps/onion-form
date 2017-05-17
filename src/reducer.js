import * as actions from './actions';
import Immutable from 'seamless-immutable';

import { reduceObject } from './helpers';

export const initialState = Immutable({
  fields: Immutable({}),
  forms: Immutable({})
});

export const deafultFieldProperties = Immutable({
  value: '',
  liveValidation: false,
  error: null,
  apiError: null
});

function reviveFields(fields) {
  return Object.keys(fields).reduce(
    (acc, field) => acc.set(field, deafultFieldProperties.merge(fields[field])),
    Immutable({})
  );
}

function revive(state) {
  const fields = (state.fields || Immutable({}));
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
  const state = !(Immutable.isImmutable(inputState)) ? revive(inputState) : inputState;

  switch (action.type) {
    case actions.REGISTER_ONION_FORM_FIELD: {
      const { form, field } = action;
      if (state.getIn(['fields', form, field])) {
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
      return reduceObject(fields,
        (acc, _, field) => acc.setIn(['fields', form, field], deafultFieldProperties),
        state
      );
    }

    case actions.CLEAR_ONION_FORM_PROPERTY: {
      const { form, property } = action;
      const fields = state.getIn(['fields', form]) || [];
      return reduceObject(fields,
        (acc, _, field) => acc.setIn(['fields', form, field, property], null),
        state
      );
    }
  }

  return state;
}
