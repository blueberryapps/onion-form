import createFormActions from './actions';
import createContextExtractor from './createContextExtractor';
import React, { Component, PropTypes as RPT } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export default function connectField(fieldName, defaultProps = {}) {
  return FieldComponent => {
    @connect(
      (state, { onionFormName }) => ({
        field: state.onionForm.getIn(['fields', onionFormName, fieldName])
      }),
      (dispatch, { onionFormName }) => ({
        actions: bindActionCreators(createFormActions(onionFormName), dispatch)
      })
    )
    class Field extends Component {
      static propTypes = {
        actions: RPT.object,
        field: RPT.object,
        onionFormName: RPT.string.isRequired,
        onionLiveValidate: RPT.func.isRequired,
        dispatch: RPT.func,
        msg: RPT.func, // custom -> given by translate() decorator #finance-translate
        label: RPT.string, // custom
        onBlur: RPT.func, // custom
        onFocus: RPT.func, // custom
        onChange: RPT.func, // custom
        tooltip: RPT.string, // custom
        hint: RPT.string, // custom
      }

      static displayName = `Form${fieldName}Field`;

      onBlur() {
        const { onBlur, actions: { setFieldLiveValidation }, onionLiveValidate } = this.props;

        const result = setFieldLiveValidation(fieldName, true);

        // call passed callback
        if (typeof onBlur === 'function')
          onBlur({ name: fieldName });

        if (typeof onionLiveValidate === 'function')
          onionLiveValidate();

        return result;
      }

      onFocus() {
        const { onFocus } = this.props;
        return onFocus && onFocus({ name: fieldName });
      }

      onChange({ value, target }) {
        const { onChange, actions: { setFieldValue }, onionLiveValidate } = this.props;

        // fix checkbox to return value based on checked/unchecked
        const newValue = typeof value === 'boolean' ? value : (value || target && ((target.type === 'checkbox') ? target.checked : target.value));

        const result = setFieldValue(fieldName, newValue);

        // call passed callback
        if (typeof onChange === 'function')
          onChange({ name: fieldName, value: newValue });

        if (typeof onionLiveValidate === 'function')
          onionLiveValidate();

        return result;
      }

      getFieldProps() {
        const { field } = this.props;
        return field ? field.toJS() : {};
      }

      msg(key) {
        const { onionFormName, msg } = this.props;

        if (!msg)
          return null;

        return msg([`form.${onionFormName}.${key}`, `form.${key}`, `${key}`]);
      }

      _resolveDefaultProps() {
        if (typeof defaultProps === 'function')
          return defaultProps(this.props) || {};

        return defaultProps;
      }

      render() {
        const { onionFormName, label, tooltip, hint } = this.props;
        const field = this.getFieldProps();
        const error = field.error || field.apiError;

        const defaultProps = this._resolveDefaultProps();

        return (
          <FieldComponent
            {...defaultProps}
            {...this.getFieldProps()}
            error={error && this.msg(`errors.${error}`, error) || error}
            hint={hint || defaultProps.hint || this.msg(`${fieldName}.hint`)}
            label={label || defaultProps.label || this.msg(`${fieldName}.label`)}
            name={fieldName}
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onionFormName={onionFormName}
            tooltip={tooltip || defaultProps.tooltip || this.msg(`${fieldName}.tooltip`)}
          />
        );
      }
    }

    return createContextExtractor(fieldName)(Field);
  };
}
