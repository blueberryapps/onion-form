import React, { Component, PropTypes as RPT } from 'react';

export default function createContextExtractor(name) {
  return (Field) => {
    class FormFieldWrapper extends Component {
      static contextTypes = {
        onionFieldRegister: RPT.func.isRequired,
        onionFormName: RPT.string.isRequired,
        onionLiveValidate: RPT.func.isRequired,
        onionOnSubmit: RPT.func.isRequired
      }

      static displayName = `Form${name}ContextExtractor`;

      render() {
        const { onionFormName, onionFieldRegister, onionLiveValidate, onionOnSubmit } = this.context;

        return (
          <Field
            {...this.props}
            onionFieldRegister={onionFieldRegister}
            onionFormName={onionFormName}
            onionLiveValidate={onionLiveValidate}
            onionOnSubmit={onionOnSubmit}
          />
        );
      }
    }

    return FormFieldWrapper;
  };
}

