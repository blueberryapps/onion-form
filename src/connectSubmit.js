import createContextExtractor from './createContextExtractor';
import hasErrors from './hasErrors';
import { connect } from 'react-redux';

export default function connectSubmit(Submit) {
  return createContextExtractor('Submit')(
    connect(
      (state, { disabled, onionFormName }) => ({
        disabled: hasErrors(state, onionFormName) || !!disabled
      }),
      (state, { onClick, onionOnSubmit }) => ({
        onClick: (event) => (onionOnSubmit(event) && typeof onClick === 'function' && onClick(event))
      })
    )(Submit)
  );
}
