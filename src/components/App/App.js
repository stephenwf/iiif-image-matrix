import React, { Component } from 'react';
import MapTheTiles from 'map-the-tiles';
import * as math from 'mathjs';
import TileSourceProvider from '../TileSourceProvider/TileSourceProvider';
import posed, { PoseGroup } from 'react-pose';

const Container = posed.div({
  enter: { opacity: 1, beforeChildren: 300 },
  exit: { opacity: 0, delay: 300 },
});

class App extends Component {
  state = {
    activeTileSource: 'https://view.nls.uk/iiif/7443/74438561.5/info.json',
    inputValue: 'https://view.nls.uk/iiif/7443/74438561.5/info.json',
    currentScaleFactor: null,
    translateX: 0,
    translateY: 0,
    zoom: 100,
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
              </div>
              <div
                style={{
                  position: 'relative',
                  width: 650,
                  height: 650,
                  overflow: 'hidden',
                }}
              >
                <PoseGroup>
                  {scale(this.state.zoom / 100)(
                    translate(this.state.translateX, this.state.translateY)(
                      displayMatrix
                    )
                  )
                    .toArray()
                    .map((row, rowId) =>
                      row.map(([x, y, width, height], cellId) => (
                        <Container
                          key={`${rowId}-${cellId}-${
                            this.state.currentScaleFactor
                          }`}
                          style={{
                            position: 'absolute',
                            left: x,
                            top: y,
                            width: width,
                            height: height,
                          }}
                        >
                          <img
                            style={{ width: '100%' }}
                            src={createImage(rowId, cellId)}
                          />
                        </Container>
                      ))
                    )}
                </PoseGroup>
              </div>
            </div>
          )}
        </TileSourceProvider>
      </div>
    );
  }
}

export default App;
