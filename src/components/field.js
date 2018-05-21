import React from 'react';

import './field.css';

class Field extends React.Component {
  propTypes: {
    row: React.PropTypes.number,
    col: React.PropTypes.number,
    opened: React.PropTypes.bool,
    flagged: React.PropTypes.bool,
    value: React.PropTypes.string,
    mine: React.PropTypes.bool,
    onOpen: React.PropTypes.func
  }

  static defaultProps = {
    row: 0,
    col: 0,
    opened: false,
    flagged: false,
    value: '0',
    mine: false
  }

  render() {
    let fieldValue = null;
    if (!this.props.opened && !this.props.flagged) {
      fieldValue = (
        <div className='field-closed'></div>
      );
    } else if (this.props.flagged) {
      fieldValue = (
        <div className='flag'></div>
      );
    } else if (this.props.opened && !this.props.mine) {
      fieldValue = (
        <div className={'field-' + this.props.value}>{this.props.value}</div>
      );
    } else {
      fieldValue = (
        <div className='mine'>{this.props.value}</div>
      );
    }
    return (
      <div
        className='field'
        onClick={(e) => {
          e.preventDefault();
          this.props.onOpen(this.props.row, this.props.col);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          this.props.onFlag(this.props.row, this.props.col);
        }} >
        {fieldValue}
      </div>
    );
  }
}

export default Field;
