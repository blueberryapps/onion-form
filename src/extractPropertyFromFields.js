export default function extractPropertyFromFields(fields, property) {
  return (fields || []).reduce(
    (acc, properties, field) => ({
      ...acc,
      [field]: properties && properties.get(property) || null
    }),
    {}
  );
}
