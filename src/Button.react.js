import React, { Component, PropTypes as RPT } from 'react';

export default class Button extends Component {

  static propTypes = {
    children: RPT.object.isRequired,
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
