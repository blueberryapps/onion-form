import * as actions from '../src/actions';
import reducer, { InitialState } from '../src/reducer';
import { assert } from 'chai';
import { Map } from 'immutable';

const initialState = new InitialState;

describe('reducer()', () => {
  it('should initialize state', () => {
    assert.deepEqual(
      reducer(undefined, {}),
      initialState
    );
  });

  it('should revive state with fields as map', () => {
    const state = reducer({ fields: { registration: { firstName: { value: 'Foo', blured: true } } } }, {});
    const value = state.get('fields');
    assert(Map.isMap(value), `Should be map but is ${typeof value}`);
  });

  it('should revive state with form as map', () => {
    const state = reducer({ fields: { registration: { firstName: { value: 'Foo', blured: true } } } }, {});
    const value = state.getIn(['fields', 'registration']);
    assert(Map.isMap(value), `Should be map but is ${typeof value}`);
    assert.deepEqual(Object.keys(state.get('fields').toJS()), ['registration']);
  });

  it('should revive state with form and field', () => {
    const state = reducer({ fields: { registration: { firstName: { value: 'Foo', blured: true } } } }, {});
    assert.deepEqual(Object.keys(state.getIn(['fields', 'registration']).toJS()), ['firstName']);
  });

  it('should revive and field should have default fields', () => {
    const state = reducer({ fields: { registration: { firstName: { value: 'Foo', blured: true } } } }, {});
    assert.deepEqual(state.getIn(['fields', 'registration', 'firstName']).toJS(), {
      apiError: null,
      value: 'Foo',
      error: null,
      liveValidation: false,
      blured: true
    });
  });

  it('should set property for field', () => {
    const action = {
      type: actions.SET_ONION_FORM_FIELD_PROPERTY,
      form: 'registration',
      field: 'firstName',
      property: 'value',
      value: 'Foo'
    };

    assert.equal(
      reducer(undefined, action).getIn(['fields', 'registration', 'firstName', 'value']),
      'Foo'
    );
  });

  it('should set property for multiple fields', () => {
    const action = {
      type: actions.SET_ONION_FORM_MULTIPLE_FIELDS,
      form: 'registration',
      property: 'value',
      values: { firstName: 'Foo', lastName: 'Bar' }
    };

    assert.equal(
      reducer(undefined, action).getIn(['fields', 'registration', 'firstName', 'value']),
      'Foo'
    );
    assert.equal(
      reducer(undefined, action).getIn(['fields', 'registration', 'lastName', 'value']),
      'Bar'
    );
  });

  it('should clear property for all fields in form', () => {
    const initState = {
      fields: {
        form1: {
          firstName: {
            apiError: 'Something strange',
            value: 'Foo'
          }
        },
        form2: {
          notClearedField: {
            apiError: 'Something realy strange',
            value: 'Foo'
          }
        }
      }
    };

    const action = {
      type: actions.CLEAR_ONION_FORM_PROPERTY,
      form: 'form1',
      property: 'apiError'
    };

    assert.equal(
      reducer(initState, action).getIn(['fields', 'form1', 'firstName', 'apiError']),
      null,
      'Property not cleared :sadface'
    );
    assert.equal(
      reducer(initState, action).getIn(['fields', 'form1', 'firstName', 'value']),
      'Foo',
      'Must not affect other properties'
    );
    assert.equal(
      reducer(initState, action).getIn(['fields', 'form2', 'notClearedField', 'apiError']),
      'Something realy strange',
      'Must not affect other forms'
    );
  });

  it('should not throw error on clearing property for nonexisting form', () => {
    const initState = {
      fields: {
        form1: {
          firstName: {
            apiError: 'Something strange',
            value: 'Foo'
          }
        },
        form2: {
          notClearedField: {
            apiError: 'Something realy strange',
            value: 'Foo'
          }
        }
      }
    };

    const action = {
      type: actions.CLEAR_ONION_FORM_PROPERTY,
      form: 'nonexistingForm',
      property: 'apiError'
    };

    assert.equal(
      reducer(initState, action).getIn(['fields', 'form2', 'notClearedField', 'apiError']),
      'Something realy strange',
      'Must not affect other forms'
    );
  });
});
