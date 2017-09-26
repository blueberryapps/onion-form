import * as actions from '../src/actions';
import reducer, { initialState, deafultFieldProperties } from '../src/reducer';
import Immutable from 'seamless-immutable';

describe('reducer()', () => {
  it('should initialize state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should revive state with fields as Immutable', () => {
    const state = reducer({ fields: { registration: { firstName: { value: 'Foo', blured: true } } } }, {});
    const value = state.fields;
    expect(Immutable.isImmutable(value)).toBe(true);
  });

  it('should revive state with form as Immutable', () => {
    const state = reducer({ fields: { registration: { firstName: { value: 'Foo', blured: true } } } }, {});
    const value = state.getIn(['fields', 'registration']);
    expect(Immutable.isImmutable(value)).toBe(true);
    expect(Object.keys(state.fields)).toEqual(['registration']);
  });

  it('should revive state with form and field', () => {
    const state = reducer({ fields: { registration: { firstName: { value: 'Foo', blured: true } } } }, {});
    expect(Object.keys(state.getIn(['fields', 'registration'])))
      .toEqual(['firstName']);
  });

  it('should revive and field should have default fields', () => {
    const state = reducer({ fields: { registration: { firstName: { value: 'Foo', blured: true } } } }, {});
    expect(state.getIn(['fields', 'registration', 'firstName']))
      .toEqual({
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

    expect(reducer(undefined, action).getIn(['fields', 'registration', 'firstName', 'value']))
      .toBe('Foo');
  });

  it('should set property for multiple fields', () => {
    const action = {
      type: actions.SET_ONION_FORM_MULTIPLE_FIELDS,
      form: 'registration',
      property: 'value',
      values: { firstName: 'Foo', lastName: 'Bar' }
    };

    expect(reducer(undefined, action).getIn(['fields', 'registration', 'firstName', 'value']))
      .toBe('Foo');
    expect(reducer(undefined, action).getIn(['fields', 'registration', 'lastName', 'value']))
      .toBe('Bar');
  });

  it('should clear all fields in form', () => {
    const initState = {
      fields: {
        form1: {
          firstName: {
            apiError: 'Something strange',
            value: 'Foo'
          },
          lastName: {
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
      type: actions.CLEAR_ONION_FORM,
      form: 'form1',
    };

    expect(reducer(initState, action).getIn(['fields', 'form1', 'firstName']))
      .toEqual(deafultFieldProperties);
    expect(reducer(initState, action).getIn(['fields', 'form1', 'lastName']))
      .toEqual(deafultFieldProperties);
    expect(reducer(initState, action).getIn(['fields', 'form2', 'notClearedField', 'apiError']))
      .toEqual('Something realy strange');
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

    expect(reducer(initState, action).getIn(['fields', 'form1', 'firstName', 'apiError']))
      .toBe(null);
    expect(reducer(initState, action).getIn(['fields', 'form1', 'firstName', 'value']))
      .toBe('Foo');
    expect(reducer(initState, action).getIn(['fields', 'form2', 'notClearedField', 'apiError']))
      .toBe('Something realy strange');
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

    expect(reducer(initState, action).getIn(['fields', 'form2', 'notClearedField', 'apiError']))
      .toBe('Something realy strange');
  });
});
