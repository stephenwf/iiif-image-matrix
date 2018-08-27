import React, { Component } from 'react';
import TileSourceProvider from '../TileSourceProvider/TileSourceProvider';
import CanvasRenderer from '../CanvasRenderer/CanvasRenderer';
import ImageRenderer from '../ImageRenderer/ImageRenderer';

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
            displayMatrix,
            imageResourceMatrix,
            makeIIIFResource,
            scaleFactors,
            translate,
            scale,
            createImage,
            displayWidth,
            displayHeight,
          }) => (
            <div>
              <div
                style={{ position: 'relative', zIndex: 10, background: '#fff' }}
              >
                X:{' '}
                <input
                  type="range"
                  min={-500}
                  max={500}
                  onChange={e =>
                    this.setState({
                      translateX: parseInt(e.currentTarget.value, 10),
                    })
                  }
                />
                Y:{' '}
                <input
                  type="range"
                  min={-500}
                  max={500}
                  onChange={e =>
                    this.setState({
                      translateY: parseInt(e.currentTarget.value, 10),
                    })
                  }
                />
                Zoom:{' '}
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
                {this.state.useCanvas ? (
                  <CanvasRenderer
                    displayWidth={displayWidth}
                    displayHeight={displayHeight}
                    createImage={createImage}
                    displayMatrix={scale(this.state.zoom / 100)(
                      translate(this.state.translateX, this.state.translateY)(
                        displayMatrix
                      )
                    )}
                  />
                ) : (
                  <ImageRenderer
                    currentScaleFactor={this.state.currentScaleFactor}
                    displayWidth={displayWidth}
                    displayHeight={displayHeight}
                    createImage={createImage}
                    displayMatrix={scale(this.state.zoom / 100)(
                      translate(this.state.translateX, this.state.translateY)(
                        displayMatrix
                      )
                    )}
                  />
                )}
              </div>
            </div>
          )}
        </TileSourceProvider>
      </div>
    );
  }
}

export default App;
