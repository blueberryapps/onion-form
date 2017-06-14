export default function validateField(value, validations = [], otherValues) {
  const validation = validations.find(validation => !!validation(value, otherValues));

  return validation ? validation(value, otherValues) : null;
}
