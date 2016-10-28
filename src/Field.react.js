import connectField from './connectField';
import React, { Component, PropTypes as RPT } from 'react';

export default class Field extends Component {

  static propTypes = {
    name: RPT.string.isRequired
  }

  render() {
    const { name } = this.props;
    const FieldInput = connectField(name, this.props)(BasicInput);

    return (<FieldInput />);
  }
}

export class BasicInput extends Component { // eslint-disable-line
  render() {
    return (<input type="text" {...this.props} />);
  }
}
