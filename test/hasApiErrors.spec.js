import hasApiErrors from '../src/hasApiErrors';
import { assert } from 'chai';
import { fromJS } from 'immutable';

describe('hasApiErrors()', () => {
  const state = {
    onionForm: fromJS({
      fields: {
        WithError: {
          foo: { apiError: 'required' },
          bar: { }
        },
        NoError: {
          foo: { apiError: null },
          bar: { }
        },
        NoFields: {}
      }
    })
  };

  it('form with at least one field with API error', () => {
    assert.isTrue(hasApiErrors(state, 'WithError'));
  });

  it('form with fields with null API error', () => {
    assert.isFalse(hasApiErrors(state, 'NoError'));
  });

  it('form with no fields', () => {
    assert.isFalse(hasApiErrors(state, 'NoFields'));
  });
});
