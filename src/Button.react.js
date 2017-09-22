import React, { Component } from 'react';
import RPT from 'prop-types';

export default class Button extends Component {

  static propTypes = {
    children: RPT.any.isRequired,
    disabled: RPT.bool.isRequired,
    onClick: RPT.func.isRequired,
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
