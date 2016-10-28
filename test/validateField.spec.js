import validateField from '../src/validateField';
import { assert } from 'chai';

describe('validateField()', () => {
  const valid = () => (null);
  const firstRequired = () => ('required');
  const secondRequired = () => ('secondRequired');
  const hardValidation = (_, otherValues) => (
    otherValues.f1 && otherValues.f2 ? null : 'they are not equal'
  );

  it('return first not null validation', () => {
    assert.deepEqual(
      validateField('some value', [valid, firstRequired, secondRequired]),
      'required'
    );
  });

  it('return null when valid', () => {
    assert.equal(validateField('some value', [valid]), null);
  });

  it('return null when no validation passed', () => {
    assert.equal(validateField('some value'), null);
  });

  it('validation is able to use all fields for decision', () => {
    assert.equal(
      validateField('some value', [hardValidation], { f1: true, f2: true }),
      null
    );

    assert.equal(
      validateField('some value', [hardValidation], { f1: true, f2: false }),
      'they are not equal'
    );
  });
});
