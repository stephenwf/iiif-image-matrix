import React, { Component } from 'react';
import { Surface, Image } from '@gfodor/react-canvas';

class CanvasRenderer extends Component {
  render() {
    const {
      displayWidth,
      displayHeight,
      displayMatrix,
      createImage,
    } = this.props;
    return (
      <div style={{ width: 'auto', height: 'auto' }}>
        <Surface width={displayWidth} height={displayHeight}>
          {displayMatrix.toArray().map((row, rowId) =>
            row.map(([x, y, width, height, shouldRender], cellId) => (
              <Image
                src={shouldRender ? createImage(rowId, cellId) : null}
                style={{
                  left: x,
                  top: y,
                  width: width,
                  height: height,
                }}
              />
            ))
          )}
        </Surface>
      </div>
    );
  }
}

export default CanvasRenderer;
