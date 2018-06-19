/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';

export class TextField extends Component {
  render() {
    return <input type="text" />;
  }
}

export class CheckBox extends Component {
  render() {
    return <input type="checkbox" />;
  }
}
