import React, { Component } from 'react';

class MouseTracker extends Component {
  state = {
    containerX: 0,
    containerY: 0,
    x: 0,
    y: 0,
    dragX: 0,
    dragY: 0,
    mouseDown: false,
  };

  setRef = ref => {
    this.element = ref;
    const { left, top } = this.element.getBoundingClientRect();
    this.setState({
      containerX: left,
      containerY: top,
    });
  };

  handleHover = ({ clientX, clientY }) => {
    if (this.element) {
      if (this.state.mouseDown) {
        this.setState(state => {
          return {
            dragX: state.x - (clientX - state.containerX),
            dragY: state.y - (clientY - state.containerY),
          };
        });
      } else {
        this.setState(state => ({
          x: clientX - state.containerX,
          y: clientY - state.containerY,
        }));
      }
    }
  };

  handleMouseDown = () => {
    this.setState({
      mouseDown: true,
    });
  };

  handleMouseUp = () => {
    if (this.props.onDragEnd) {
      this.props.onDragEnd({
        x: this.state.dragX,
        y: this.state.dragY,
      });
    }
    this.setState({
      mouseDown: false,
      dragX: 0,
      dragY: 0,
    });
  };

  render() {
    return (
      <div
        onMouseMoveCapture={this.handleHover}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        ref={this.setRef}
      >
        <div style={{ pointerEvents: 'none' }}>
          {this.props.children({ ...this.state })}
        </div>
      </div>
    );
  }
}

export default MouseTracker;
