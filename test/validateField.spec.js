import validateField from '../src/validateField';

describe('validateField()', () => {
  const valid = () => (null);
  const firstRequired = () => ('required');
  const secondRequired = () => ('secondRequired');
  const hardValidation = (_, otherValues) => (
    otherValues.f1 && otherValues.f2 ? null : 'they are not equal'
  );

  it('return first not null validation', () => {
    expect(validateField('some value', [valid, firstRequired, secondRequired]))
      .toBe('required');
  });

  it('return null when valid', () => {
    expect(validateField('some value', [valid])).toBe(null);
  });

  it('return null when no validation passed', () => {
    expect(validateField('some value')).toBe(null);
  });

  it('validation is able to use all fields for decision', () => {
    expect(validateField('some value', [hardValidation], { f1: true, f2: true }))
      .toBe(null);
    expect(validateField('some value', [hardValidation], { f1: true, f2: false }))
      .toBe('they are not equal');
  });
});
