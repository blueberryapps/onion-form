// @flow
import React, { Component } from 'react';

export default class Button extends Component {
  props: {
    children: Object,
    disabled: boolean,
    onClick: Function
  }

  render() {
    const { children, onClick, disabled } = this.props;

    return (
      <button disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }
}
