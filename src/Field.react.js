import React, { Component } from 'react';
import RPT from 'prop-types';

import connectField from './connectField';

export default class Field extends Component {
  static propTypes = {
    component: RPT.any,
    name: RPT.string.isRequired
  }

  render() {
    const { name, component } = this.props;
    const FieldInput = connectField(name, this.props)(component || BasicInput);

    return (<FieldInput />);
  }
}

export class BasicInput extends Component { // eslint-disable-line
  static propTypes = {
    error: RPT.string,
    id: RPT.string,
    label: RPT.string,
    name: RPT.string,
    value: RPT.string,
    placeholder: RPT.string,
    onBlur: RPT.func,
    onChange: RPT.func,
    onFocus: RPT.func,
  }

  render() {
    const {
      id, label, error, name, value, placeholder, onBlur, onChange, onFocus
    } = this.props;

    return (
      <div>
        {label && <label htmlFor={id}>{label}</label>}
        <input
          type="text"
          {...{
            id, name, value, placeholder, onBlur, onChange, onFocus
          }}
        />
        {error && <div className="error">{error}</div>}
      </div>
    );
  }
}
