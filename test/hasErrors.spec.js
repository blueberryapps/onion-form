import hasErrors from '../src/hasErrors';
import { assert } from 'chai';
import Immutable from 'seamless-immutable';

describe('hasErrors()', () => {
  const state = {
    onionForm: Immutable({
      fields: {
        WithError: {
          foo: { error: 'required' },
          bar: { }
        },
        NoError: {
          foo: { error: null },
          bar: { }
        },
        NoFields: {}
      }
    })
  };

  it('form with at least one field with error', () => {
    assert.isTrue(hasErrors(state, 'WithError'));
  });

  it('form with fields with null error', () => {
    assert.isFalse(hasErrors(state, 'NoError'));
  });

  it('form with no fields', () => {
    assert.isFalse(hasErrors(state, 'NoFields'));
  });
});
