import createContextExtractor from './createContextExtractor';
import createFormActions from './actions';
import React, { Component } from 'react';
import RPT from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export default function connectField(fieldName, defaultProps = {}, customValidations = []) {
  return FieldComponent => {
    @connect(
      (state, { onionFormName, name }) => ({
        field: state.onionForm.getIn(['fields', onionFormName, name || fieldName])
      }),
      (dispatch, { onionFormName }) => ({
        actions: bindActionCreators(createFormActions(onionFormName), dispatch)
      })
    )
    class Field extends Component {
      static propTypes = {
        actions: RPT.object,
        dispatch: RPT.func,
        defaultValue: RPT.string,
        field: RPT.object,
        hint: RPT.string, // custom
        label: RPT.string, // custom
        msg: RPT.func, // custom -> given by translate() decorator #finance-translate
        name: RPT.string,
        onBlur: RPT.func, // custom
        onChange: RPT.func, // custom
        onFocus: RPT.func, // custom
        onionFieldRegister: RPT.func.isRequired,
        onionFormName: RPT.string.isRequired,
        onionLiveValidate: RPT.func.isRequired,
        placeholder: RPT.string, // custom
        tooltip: RPT.string, // custom
        validations: RPT.array
      }

      static defaultProps = {
        name: fieldName
      }

      static displayName = `Form${fieldName}Field`;

      componentDidMount() {
        const { name, onionFieldRegister } = this.props;
        onionFieldRegister(name, this);
        this._setDefaultValue(this.props);
      }

      componentWillReceiveProps(next) {
        const { name, onionFieldRegister } = this.props;
        if (name !== next.name) {
          onionFieldRegister(name, null);
          onionFieldRegister(next.name, this);
          this._setDefaultValue(next);
        }
      }

      componentWillUnmount() {
        const { name, onionFieldRegister } = this.props;
        onionFieldRegister(name, null);
      }

      onBlur() {
        const { name, field: { liveValidation }, onBlur, actions: { setFieldLiveValidation }, onionLiveValidate } = this.props;

        // if live validation is not already set, set it now
        const result = (!liveValidation) ? setFieldLiveValidation(name, true) : true;

        // call passed callback
        if (typeof onBlur === 'function')
          onBlur({ name });

        if (typeof onionLiveValidate === 'function')
          onionLiveValidate();

        return result;
      }

      onFocus() {
        const { name, onFocus } = this.props;
        return onFocus && onFocus({ name });
      }

      onChange({ value, target }) {
        const { name, onChange, actions: { setFieldValue }, onionLiveValidate } = this.props;

        // fix checkbox to return value based on checked/unchecked
        const newValue = typeof value === 'boolean' ? value : (value || target && ((target.type === 'checkbox') ? target.checked : target.value));

        const result = setFieldValue(name, newValue);

        // call passed callback
        if (typeof onChange === 'function')
          onChange({ name, value: newValue });

        if (typeof onionLiveValidate === 'function')
          onionLiveValidate();

        return result;
      }

      getFieldProps(props = this.props) {
        const { field } = props;
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

      _setDefaultValue(props) {
        const fieldProps = this.getFieldProps(props);

        // Enable to set default value only if value is undefined
        if (typeof fieldProps.value !== 'undefined') {
          return;
        }

        const defaultValueToSet = props.defaultValue || defaultProps.defaultValue || fieldProps.value;
        const { actions: { setFieldValue } } = props;

        setFieldValue(props.name, defaultValueToSet);
      }

      render() {
        const { name, onionFormName, label, tooltip, hint, placeholder, ...rest } = this.props;
        const field = this.getFieldProps();
        const error = field.error || field.apiError;

        const defaultProps = this._resolveDefaultProps();
        const fieldProps = this.getFieldProps();

        return (
          <FieldComponent
            {...rest}
            {...defaultProps}
            {...fieldProps}
            value={fieldProps.value || ''}
            error={error && this.msg(`errors.${error}`, error) || error}
            hint={hint || defaultProps.hint || this.msg(`${name}.hint`)}
            label={label || defaultProps.label || this.msg(`${name}.label`)}
            placeholder={placeholder || defaultProps.placeholder || this.msg(`${name}.placeholder`)}
            name={name}
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onionFormName={onionFormName}
            tooltip={tooltip || defaultProps.tooltip || this.msg(`${name}.tooltip`)}
          />
        );
      }
    }

    return createContextExtractor(fieldName)(Field);
  };
}
