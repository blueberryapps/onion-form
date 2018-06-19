import React, { Component } from 'react';
import RPT from 'prop-types';

export default function createContextExtractor(name) {
  return (Field) => {
    class FormFieldWrapper extends Component {
      static displayName = `Form${name}ContextExtractor`;

      static contextTypes = {
        onionIsValid: RPT.func.isRequired,
        onionFieldRegister: RPT.func.isRequired,
        onionFormName: RPT.string.isRequired,
        onionLiveValidate: RPT.func.isRequired,
        onionOnSubmit: RPT.func.isRequired
      }

      render() {
        const {
          onionIsValid, onionFormName, onionFieldRegister, onionLiveValidate, onionOnSubmit
        } = this.context;

        return (
          <Field
            {...this.props}
            onionIsValid={onionIsValid}
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

