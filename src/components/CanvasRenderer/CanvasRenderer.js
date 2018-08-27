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
      <Surface width={displayWidth} height={displayHeight}>
        {displayMatrix.toArray().map((row, rowId) =>
          row.map(([x, y, width, height], cellId) => (
            <Image
              src={createImage(rowId, cellId)}
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
    );
  }
}

export default CanvasRenderer;
