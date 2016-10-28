import extractPropertyFromFields from './extractPropertyFromFields';

export default function extractPropertyFromState(state, formName, property) {
  return extractPropertyFromFields(
    (state.onionForm.getIn(['fields', formName]) || []),
    property
  );
}
