// @flow
import extractPropertyFromFields from './extractPropertyFromFields';
import type { StateType } from './types';

export default function extractPropertyFromState(state: StateType, formName: string, property: string): Object {
  return extractPropertyFromFields(
    (state.onionForm.getIn(['fields', formName]) || []),
    property
  );
}
