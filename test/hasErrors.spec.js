import { fromJS } from 'immutable';

import hasErrors from '../src/hasErrors';

describe('hasErrors()', () => {
  const state = {
    onionForm: fromJS({
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
    expect(hasErrors(state, 'WithError')).toBe(true);
  });

  it('form with fields with null error', () => {
    expect(hasErrors(state, 'NoError')).toBe(false);
  });

  it('form with no fields', () => {
    expect(hasErrors(state, 'NoFields')).toBe(false);
  });
});
