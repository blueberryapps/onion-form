import extractPropertyFromState from './extractPropertyFromState';
import hasErrors from './hasErrors';
import React, { Component, PropTypes as RPT } from 'react';
import validateField from './validateField';
import { clearFormProperty, setMultipleFields } from './actions';

export default class Form extends Component {

  static propTypes = {
    children: RPT.oneOfType([RPT.node, RPT.arrayOf(RPT.node)]).isRequired,
    name: RPT.string.isRequired,
    onSubmit: RPT.func,
    validations: RPT.object
  }

  static contextTypes = {
    store: RPT.object.isRequired
  }

  static childContextTypes = {
    onionFormName: RPT.string.isRequired,
    onionLiveValidate: RPT.func.isRequired,
    onionOnSubmit: RPT.func.isRequired,
  }

  defaultProps = {
    validations: {}
  }

  getChildContext() {
    return {
      onionFormName: this.props.name,
      onionLiveValidate: this.liveValidate.bind(this),
      onionOnSubmit: this.onSubmit.bind(this)
    };
  }

  onSubmit(event) {
    event.preventDefault();
    return this._submit();
  }

  liveValidate() {
    const { validations, name } = this.props;
    const { store: { getState } } = this.context;

    const liveValidationsEnabled = extractPropertyFromState(
      getState(),
      name,
      'liveValidation'
    );

    const liveValidations = Object.keys(liveValidationsEnabled).reduce(
      (acc, field) => (
        liveValidationsEnabled[field]
          ? { ...acc, [field]: validations[field] }
          : acc
      ),
      {}
    );

    return this.validate(liveValidations);
  }

  formValidate() {
    const { validations } = this.props;

    this._enableAllFiledsLiveValidation();

    return this.validate(validations);
  }

  validate(enabledValidations) {
    const { name } = this.props;
    const { store: { dispatch } } = this.context;

    return dispatch(
      setMultipleFields(
        name,
        'error',
        this._getValidationErrors(enabledValidations)
      )
    );
  }

  _submit() {
    const { name, onSubmit } = this.props;
    const values = this._getValues();

    // check for validation errors
    if (!this._isValid())
      return false;

    if (typeof onSubmit === 'function')
      onSubmit({
        name,
        values
      });

    return true;
  }

  _isValid() {
    const { name } = this.props;
    const { store: { dispatch } } = this.context;

    // Cleanup all previous errors
    dispatch(clearFormProperty(name, 'error'));

    // Validate all fields
    this.formValidate();

    return !this._hasErrors();
  }

  _hasErrors() {
    const { name } = this.props;
    const { store: { getState } } = this.context;

    return hasErrors(getState(), name);
  }

  _getValues() {
    const { name } = this.props;
    const { store: { getState } } = this.context;

    return extractPropertyFromState(getState(), name, 'value');
  }

  _getValidationErrors(enabledValidations) {
    const values = this._getValues();

    return Object.keys(enabledValidations).reduce( // this will create { field1: null, field2: 'required', ...}
      (acc, field) => ({
        ...acc,
        [field]: validateField(values[field], enabledValidations[field], values)
      }),
      {}
    );
  }

  _enableAllFiledsLiveValidation() {
    const { name, validations } = this.props;
    const { store: { dispatch } } = this.context;

    return dispatch(
      setMultipleFields(
        name,
        'liveValidation',
        Object.keys(validations).reduce( // this will create { field1: true, field2: true, ...}
          (acc, field) => ({ ...acc, [field]: true }),
          {}
        )
      )
    );
  }

  render() {
    const { children } = this.props;

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        {children}
      </form>
    );
  }
}
