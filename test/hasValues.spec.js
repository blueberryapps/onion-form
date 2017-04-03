import hasValues from '../src/hasValues';
import { assert } from 'chai';
import { fromJS } from 'immutable';

describe('hasValues()', () => {
  const state = {
    onionForm: fromJS({
      fields: {
        WithValue: {
          foo: { value: 'required' },
          bar: { }
        },
        NoValue: {
          foo: { value: null },
          bar: { }
        },
        NoFields: {}
      }
    })
  };

  it('form with at least one field with value', () => {
    assert.isTrue(hasValues(state, 'WithValue'));
  });

  it('form with fields with null value', () => {
    assert.isFalse(hasValues(state, 'NoValue'));
  });

  it('form with no fields', () => {
    assert.isFalse(hasValues(state, 'NoFields'));
  });
});
