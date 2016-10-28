import React, { Component, PropTypes as RPT } from 'react';

export default class Submit extends Component {

  static propTypes = {
    children: RPT.oneOfType([RPT.node, RPT.string]).isRequired,
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
