import createContextExtractor from './createContextExtractor';
import createFormActions from './actions';
import React, { Component, PropTypes as RPT } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export default function connectField(fieldName, defaultProps = {}, customValidations = []) {
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
        dispatch: RPT.func,
        field: RPT.object,
        hint: RPT.string, // custom
        label: RPT.string, // custom
        msg: RPT.func, // custom -> given by translate() decorator #finance-translate
        onBlur: RPT.func, // custom
        onChange: RPT.func, // custom
        onFocus: RPT.func, // custom
        onionFieldRegister: RPT.func.isRequired,
        onionFormName: RPT.string.isRequired,
        onionLiveValidate: RPT.func.isRequired,
        tooltip: RPT.string, // custom
        validations: RPT.array
      }

      static displayName = `Form${fieldName}Field`;

      componentDidMount() {
        const { onionFieldRegister } = this.props;
        onionFieldRegister(fieldName, this);
      }

      componentWillUnmount() {
        const { onionFieldRegister } = this.props;
        onionFieldRegister(fieldName, null);
      }

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

      validations() {
        return customValidations;
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
        const { onionFormName, label, tooltip, hint, ...rest } = this.props;
        const field = this.getFieldProps();
        const error = field.error || field.apiError;

        const defaultProps = this._resolveDefaultProps();

        return (
          <FieldComponent
            {...rest}
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
