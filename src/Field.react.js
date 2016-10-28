import connectField from './connectField';
import React, { Component, PropTypes as RPT } from 'react';

export default class Field extends Component {

  static propTypes = {
    name:  RPT.string.isRequired,
    component: RPT.object
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
    label: RPT.string
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
