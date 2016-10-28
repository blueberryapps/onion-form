export default function validateField(value, validations, otherValues) {
  const errors = (validations || []).reduce(
    (errors, validation) => errors.concat(validation(value, otherValues) || []),
    []
  );
  return errors[0] || null;
}
