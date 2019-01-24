import React, { Component } from 'react';
import TileSourceProvider from '../TileSourceProvider/TileSourceProvider';
import CanvasRenderer from '../CanvasRenderer/CanvasRenderer';
import ImageRenderer from '../ImageRenderer/ImageRenderer';
import MouseTracker from '../MouseTracker/MouseTracker';
import {
  compose,
  displayMatrix,
  filter,
  inverse,
  scale, scaleAtOrigin,
  translate,
} from '../../transforms';

class App extends Component {
  state = {
    activeTileSource: 'https://view.nls.uk/iiif/7443/74438561.5/info.json',
    inputValue: 'https://view.nls.uk/iiif/7443/74438561.5/info.json',
    currentScaleFactor: null,
    translateX: 0,
    translateY: 0,
    zoom: 100,
    useCanvas: false,
  };

  setNewScaleFactor = k => {
    this.setState({ currentScaleFactor: k });
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.inputValue}
          onChange={e => this.setState({ inputValue: e.currentTarget.value })}
        />
        <button
          onClick={() =>
            this.setState({
              activeTileSource: this.state.inputValue,
              currentScaleFactor: null,
              translateX: 0,
              translateY: 0,
              zoom: 100,
            })
          }
        >
          Load tile-source
        </button>
        <label htmlFor="useCanvas">
          <input
            type="checkbox"
            id="useCanvas"
            value={this.state.useCanvas}
            onChange={() => this.setState({ useCanvas: !this.state.useCanvas })}
          />
          Use Canvas
        </label>

        <TileSourceProvider
          displayWidth={650}
          scaleFactor={this.state.currentScaleFactor}
          imageService={this.state.activeTileSource}
        >
          {({
            matrix,
            imageResourceMatrix,
            makeIIIFResource,
            currentWidth,
            scaleFactors,
            createImage,
            displayWidth,
            displayHeight,
          }) => {
            return (
              <div>
                <div
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    background: '#fff',
                  }}
                >
                  X:
                  <input
                    type="range"
                    min={-500}
                    max={500}
                    value={this.state.translateX}
                    onChange={e =>
                      this.setState({
                        translateX: parseInt(e.currentTarget.value, 10),
                      })
                    }
                  />
                  Y:
                  <input
                    type="range"
                    min={-500}
                    max={500}
                    value={this.state.translateY}
                    onChange={e =>
                      this.setState({
                        translateY: parseInt(e.currentTarget.value, 10),
                      })
                    }
                  />
                  Zoom:
                  <input
                    type="range"
                    min={50}
                    max={(scaleFactors.length - 2) * 100}
                    value={this.state.zoom}
                    onChange={e =>
                      this.setState({
                        zoom: parseInt(e.currentTarget.value, 10),
                      })
                    }
                  />
                  {scaleFactors.map((v, k) => (
                    <button
                      key={k}
                      style={{
                        outline: 'none',
                        background:
                          k === this.state.currentScaleFactor
                            ? 'lightblue'
                            : '#fff',
                      }}
                      onClick={() => this.setNewScaleFactor(k)}
                    >
                      Quality {k}
                    </button>
                  ))}
                  <br />
                  <MouseTracker
                    onDragEnd={({ x, y }) => {
                      this.setState({
                        translateX: this.state.translateX - x,
                        translateY: this.state.translateY - y,
                      });
                    }}
                  >
                    {({ x, y, dragX, dragY, setRef, zoom }) => {
                      const transformer = compose(
                        // First make resize to fit display width
                        displayMatrix(displayWidth, currentWidth),
                        // Scale the whole image based on zoom
                        scale(zoom / 100),
                        // Apply opposite X,Y for current dragging position
                        inverse(translate(dragX, dragY)),
                        // Apply translation
                        translate(this.state.translateX, this.state.translateY),
                        // Finally, filter hidden images
                        filter(0, 0, displayWidth, displayHeight, 100)
                      );
                      // const canvasTransform = compose(
                      //   inverse(scale(currentScaleFactor)),
                      //   transformer
                      // );
                      const scaleF = Math.floor(
                        Math.abs(Math.max(0, 4 - zoom / 100))
                      );
                      console.log(this.state.currentScaleFactor);
                      if (
                        this.state.currentScaleFactor !== null &&
                        this.state.currentScaleFactor !== scaleF
                      ) {
                        console.log(scaleF);
                        this.setState(() => ({ currentScaleFactor: scaleF }));
                      }
                      // console.log(Math.floor(Math.abs(4 - (zoom / 200))));
                      return (
                        <div style={{ position: 'relative' }}>
                          {this.state.useCanvas ? (
                            <CanvasRenderer
                              setRef={setRef}
                              displayWidth={displayWidth}
                              displayHeight={displayHeight}
                              createImage={createImage}
                              displayMatrix={transformer.transform(matrix)}
                            />
                          ) : (
                            <ImageRenderer
                              setRef={setRef}
                              currentScaleFactor={this.state.currentScaleFactor}
                              displayWidth={displayWidth}
                              displayHeight={displayHeight}
                              createImage={createImage}
                              displayMatrix={transformer.transform(matrix)}
                            />
                          )}
                        </div>
                      );
                    }}
                  </MouseTracker>
                </div>
              </div>
            );
          }}
        </TileSourceProvider>
      </div>
    );
  }
}

export default App;
