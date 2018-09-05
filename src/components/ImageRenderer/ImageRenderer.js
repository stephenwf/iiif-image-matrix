import React, { Component } from 'react';
import posed, { PoseGroup } from 'react-pose';
import Draggable from 'react-draggable'; // The default

const Container = posed.div({
  enter: { opacity: 1, beforeChildren: 300 },
  exit: { opacity: 0, delay: 300 },
});

class ImageRenderer extends Component {
  render() {
    const {
      displayWidth,
      displayHeight,
      displayMatrix,
      createImage,
      currentScaleFactor,
    } = this.props;

    return (
      <div
        style={{
          position: 'relative',
          width: displayWidth,
          height: displayHeight,
          overflow: 'hidden',
        }}
      >
        <div style={{ height: 'auto', width: 'auto' }}>
          <PoseGroup>
            <Container key={currentScaleFactor}>
              {displayMatrix.toArray().map((row, rowId) =>
                row.map(([x, y, width, height, shouldRender], cellId) => (
                  <div
                    key={`${rowId}--${cellId}`}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width: width,
                      height: height,
                    }}
                  >
                    {shouldRender ? (
                      <img
                        style={{ width: '100%' }}
                        src={createImage(rowId, cellId)}
                      />
                    ) : null}
                  </div>
                ))
              )}
            </Container>
          </PoseGroup>
        </div>
      </div>
    );
  }
}

export default ImageRenderer;
