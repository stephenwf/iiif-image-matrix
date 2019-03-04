import React, { Component } from 'react';
import panzoom from 'pan-zoom';

class MouseTracker extends Component {
  state = {
    containerX: 0,
    containerY: 0,
    x: 0,
    y: 0,
    dragX: 0,
    dragY: 0,
    mouseDown: false,
    zoom: 100,
  };

  setRef = ref => {
    this.element = ref;
    const { left, top } = this.element.getBoundingClientRect();
    this.setState({
      containerX: left,
      containerY: top,
    });
  };

  unpanzoom = () => {};

  componentDidMount() {
    this.unpanzoom = panzoom(document.body, e => {
      this.setState(s => ({
        dragX: s.dragX - e.dx + (e.dz ? e.x / this.state.zoom - e.dz : 0),
        dragY: s.dragY - e.dy + (e.dz ? e.y / this.state.zoom - e.dz : 0),
        zoom: s.zoom - e.dz,
      }));
    });
  }

  componentWillUnmount() {
    this.unpanzoom();
  }

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
      // this.props.onDragEnd({
      //   x: this.state.dragX,
      //   y: this.state.dragY,
      // });
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
        // onMouseMoveCapture={this.handleHover}
        // onMouseDown={this.handleMouseDown}
        // onMouseUp={this.handleMouseUp}
        ref={this.setRef}
      >
        <div style={{ pointerEvents: 'visible' }}>
          {this.props.children({ ...this.state })}
        </div>
      </div>
    );
  }
}

export default MouseTracker;
