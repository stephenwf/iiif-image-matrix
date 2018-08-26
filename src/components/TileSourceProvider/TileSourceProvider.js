import React, { Component } from 'react';
import MapTheTiles from 'map-the-tiles';
import * as math from 'mathjs';

class TileSourceProvider extends Component {
  componentDidMount() {
    this.loadNewResource(
      this.props.imageService,
      this.props.scaleFactor,
      this.props.displayWidth
    );
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.imageService !== this.props.imageService) {
      return this.loadNewResource(
        nextProps.imageService,
        nextProps.scaleFactor,
        nextProps.displayWidth
      );
    }
    if (
      nextProps.scaleFactor !== this.props.scaleFactor ||
      nextProps.displayWidth !== this.props.displayWidth
    ) {
      this.setScaleFactor(nextProps.scaleFactor, nextProps.displayWidth);
    }
  }

  loadNewResource(resource, scaleFactor, displayWidth) {
    fetch(resource)
      .then(r => r.json())
      .then(resp => {
        const { height, width, tiles } = resp;
        const firstTileSet = tiles[0];
        if (!firstTileSet.height) {
          firstTileSet.height = firstTileSet.width;
        }

        this.setState({
          id: resp['@id'],
          height,
          width,
          tileSet: firstTileSet,
          scaleFactors: firstTileSet.scaleFactors,
        });

        this.setScaleFactor(scaleFactor, displayWidth);
      });
  }

  setScaleFactor(scaleFactorIndex, displayWidth) {
    const { scaleFactors } = this.state;
    const scaleFactor =
      typeof scaleFactors[scaleFactorIndex] !== 'undefined'
        ? scaleFactors[scaleFactorIndex]
        : scaleFactors[scaleFactors.length - 1];

    const { height, width, tileSet } = this.state;

    const fullWidth = Math.ceil(width / scaleFactor);
    const fullHeight = Math.ceil(height / scaleFactor);

    const tilesX = Math.ceil(fullWidth / tileSet.width);
    const tilesY = Math.ceil(fullHeight / tileSet.height);

    const emptyTileMatrix = math.zeros(tilesX, tilesY, 4);

    const matrix = emptyTileMatrix.map((value, [x, y, z]) => {
      const rx = x * tileSet.width;
      const ry = y * tileSet.height;
      switch (z) {
        case 0:
          return rx;
        case 1:
          return ry;
        case 2:
          return rx + tileSet.width < fullWidth
            ? tileSet.width
            : fullWidth - rx;
        case 3:
          return ry + tileSet.height < fullHeight
            ? tileSet.height
            : fullHeight - ry;
      }
    });

    this.setState({
      currentWidth: fullWidth,
      currentHeight: fullHeight,
      matrix,
      imageResourceMatrix: matrix.map(value => value * scaleFactor),
      displayMatrix: matrix.map((value, [x, y, v]) => {
        return value * (displayWidth / fullWidth);
      }),
    });
  }

  translate = (x, y) => matrix =>
    matrix.map((value, [x1, y1, v]) => {
      switch (v) {
        case 0: // x
          return value + x;
        case 1: // y
          return value + y;
        default:
          return value;
      }
    });

  scale = factor => matrix => matrix.map(value => value * factor);

  makeIIIFResource = ({ x, y, width, height, region, tileWidth }) => {
    return `${
      this.state.id
    }/${x},${y},${width},${height}/${tileWidth},/0/default.jpg`;
  };

  state = {
    currentWidth: 0,
    currentHeight: 0,
    id: null,
    matrix: math.matrix(),
    displayMatrix: math.matrix(),
    imageResourceMatrix: math.matrix(),
    scaleFactors: [],
    currentScaleFactor: null,
  };

  render() {
    const {
      id,
      scaleFactors,
      matrix,
      imageResourceMatrix,
      displayMatrix,
      currentWidth,
      currentHeight,
      currentScaleFactor,
    } = this.state;
    const { children, scaleFactor } = this.props;

    return children({
      id,
      scaleFactors,
      scaleFactor,
      currentWidth,
      currentHeight,
      currentScaleFactor,
      matrix,
      displayMatrix,
      imageResourceMatrix,
      translate: this.translate,
      scale: this.scale,
      makeIIIFResource: this.makeIIIFResource,
      createImage: (rowId, cellId) =>
        this.makeIIIFResource({
          x: imageResourceMatrix.get([rowId, cellId, 0]),
          y: imageResourceMatrix.get([rowId, cellId, 1]),
          width: imageResourceMatrix.get([rowId, cellId, 2]),
          height: imageResourceMatrix.get([rowId, cellId, 3]),
          tileWidth: 256,
        }),
    });
  }
}

export default TileSourceProvider;
