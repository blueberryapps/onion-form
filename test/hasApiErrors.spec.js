import hasApiErrors from '../src/hasApiErrors';
import Immutable from 'seamless-immutable';

describe('hasApiErrors()', () => {
  const state = {
    onionForm: Immutable({
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
    expect(hasApiErrors(state, 'WithError')).toBe(true);
  });

  it('form with fields with null API error', () => {
    expect(hasApiErrors(state, 'NoError')).toBe(false);
  });

  it('form with no fields', () => {
    expect(hasApiErrors(state, 'NoFields')).toBe(false);
  });
});
