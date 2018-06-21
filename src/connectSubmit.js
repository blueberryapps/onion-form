import { connect } from 'react-redux';

import createContextExtractor from './createContextExtractor';
import hasApiErrors from './hasApiErrors';
import hasErrors from './hasErrors';
import hasValues from './hasValues';

export default function connectSubmit(Submit) {
  return createContextExtractor('Submit')(connect(
    (state, { disabled, onionFormName, onionIsValid }) => {
      const anyValidationErrors = hasErrors(state, onionFormName);
      const anyApiErrors = hasApiErrors(state, onionFormName);
      const anyValues = hasValues(state, onionFormName);

      return {
        disabled: anyValidationErrors || !!disabled,
        hasErrors: anyValidationErrors || anyApiErrors,
        valid: onionIsValid(),
        hasValues: anyValues
      };
    },
    (state, { onClick, onionOnSubmit }) => ({
      onClick: event => (onionOnSubmit(event) && typeof onClick === 'function' && onClick(event))
    })
  )(Submit));
}
