import extractPropertyFromState from './extractPropertyFromState';
import hasErrors from './hasErrors';
import React, { Component } from 'react';
import validateField from './validateField';
import { Map } from 'immutable';
import { clearFormProperty, setMultipleFields, registerField } from './actions';
import RPT from 'prop-types';

export default class Form extends Component {

  static propTypes = {
    children: RPT.oneOfType([RPT.node, RPT.string, RPT.arrayOf(RPT.node)]).isRequired,
    method: RPT.string,
    name: RPT.string.isRequired,
    onError: RPT.func,
    onSubmit: RPT.func,
    validations: RPT.object
  }

  static contextTypes = {
    onionFormName: RPT.string,
    store: RPT.object.isRequired
  }

  static childContextTypes = {
    onionIsValid: RPT.func.isRequired,
    onionFieldRegister: RPT.func.isRequired,
    onionFormName: RPT.string.isRequired,
    onionLiveValidate: RPT.func.isRequired,
    onionOnSubmit: RPT.func.isRequired,
  }

  static defaultProps = {
    method: 'POST',
    validations: {}
  }

  getChildContext() {
    return {
      onionIsValid: this.isFormValid.bind(this),
      onionFieldRegister: this.fieldRegister.bind(this),
      onionFormName: this.props.name,
      onionLiveValidate: this.liveValidate.bind(this),
      onionOnSubmit: this.onSubmit.bind(this)
    };
  }

  onSubmit(event) {
    event.preventDefault();
    return this._submit();
  }

  fields = {}

  liveValidate() {
    const { name } = this.props;
    const { store: { getState } } = this.context;

    const liveValidationsEnabled = extractPropertyFromState(
      getState(),
      name,
      'liveValidation'
    );

    const fieldsToValidate = Object.keys(this.fields)
      .filter(fieldName => liveValidationsEnabled[fieldName]);

    return this.validate(fieldsToValidate);
  }

  fieldRegister(fieldName, field) {
    const { name } = this.props;
    const { store: { getState, dispatch } } = this.context;


    if (field) {
      this.fields[fieldName] = field;

      // Try if field has already data in store
      if (Map.isMap(getState().onionForm.getIn(['fields', name, fieldName]))) {
        // Lets try to validate it!
        const errors = this._getValidationErrors(this._allFieldNames());
        if (!this.hasAnyError(errors)) {
          // Save these errors to state just to change it so submit button will refresh
          dispatch(
            setMultipleFields(
              name,
              'onInitError',
              errors
            )
          );
        }
      } else {
        // It has no footprint so register it
        dispatch(registerField(name, fieldName));
      }
    } else {
      delete this.fields[fieldName];
    }
  }

  formValidate() {
    this._enableAllFieldsLiveValidation();

    return this.validate(this._allFieldNames());
  }

  isFormValid() {
    const errors = this._getValidationErrors(this._allFieldNames());

    return this.hasAnyError(errors);
  }

  hasAnyError(errors) {
    return !Object.keys(errors).reduce((acc, error) => acc || errors[error], false);
  }

  validate(fieldsToValidate) {
    const { name } = this.props;
    const { store: { dispatch } } = this.context;

    return dispatch(
      setMultipleFields(
        name,
        'error',
        this._getValidationErrors(fieldsToValidate)
      )
    );
  }

  _submit() {
    const { name, onError, onSubmit } = this.props;
    const values = this._getValues();
    const errors = this._getErrors();

    // check for validation errors
    if (!this._isValid()) {
      if (typeof onError === 'function')
        onError({ name, errors });
      return false;
    }

    if (typeof onSubmit === 'function')
      onSubmit({ name, values });
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

  _getErrors() {
    const { name } = this.props;
    const { store: { getState } } = this.context;

    return extractPropertyFromState(getState(), name, 'error');
  }

  _getValues() {
    const { name } = this.props;
    const { store: { getState } } = this.context;

    return extractPropertyFromState(getState(), name, 'value');
  }

  _extractValidationsFromField(fieldName) {
    const field = this.fields[fieldName];
    const { validations } = this.props;
    if (!field || typeof field.validations !== 'function' || !field.props) return validations[fieldName] || [];

    return (validations[fieldName] || []) // 1. validations from form level <Form validations={{'name': [isRequired()]}} />
      .concat(field.validations() || []) // 2. add validations from createField level createField('name', {}, [isRequired()])
      .concat(field.props.validations || []); // 3. add validations from instance level <Field validations=[isRequired()] />
  }

  _getValidationErrors(fieldsToValidate) {
    const values = this._getValues();

    return fieldsToValidate.reduce((acc, fieldName) => ({
      ...acc,
      [fieldName]: validateField(values[fieldName], this._extractValidationsFromField(fieldName), values)
    }), {});
  }

  _enableAllFieldsLiveValidation() {
    const { name } = this.props;
    const { store: { dispatch } } = this.context;

    return dispatch(
      setMultipleFields(
        name,
        'liveValidation',
        this._allFieldNames().reduce( // this will create { field1: true, field2: true, ...}
          (acc, field) => ({ ...acc, [field]: true }),
          {}
        )
      )
    );
  }

  _allFieldNames() {
    const { validations } = this.props;
    return Object.keys(this.fields).concat(Object.keys(validations));
  }

  render() {
    const { children, method } = this.props;
    const { onionFormName } = this.context;
    const props = {
      method,
      onSubmit: this.onSubmit.bind(this)
    };

    return onionFormName ?
      <div>{children}</div> :
      <form {...props}>{children}</form>;
  }
}
