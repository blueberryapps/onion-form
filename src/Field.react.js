// @flow
import connectField from './connectField';
import React, { Component } from 'react';

export default class Field extends Component {
  props: {
    component?: Class<React.Component<*, *, *>>, // eslint-disable-line no-undef
    name: string
  }

  render() {
    const { name, component } = this.props;
    const FieldInput = connectField(name, this.props)(component || BasicInput);

    return (<FieldInput />);
  }
}

export class BasicInput extends Component { // eslint-disable-line
  props: {
    label?: string,
    error?: string
  }

  render() {
    const { label, error } = this.props;

    return (
      <div>
        {label && <label>{label}</label>}
        <input type="text" {...this.props} />
        {error && <div className="error">{error}</div>}
      </div>
    );
  }
}
