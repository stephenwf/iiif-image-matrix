import React, { Component } from 'react';
import MapTheTiles from 'map-the-tiles';
import * as math from 'mathjs';
import { displayMatrix, scale } from '../../transforms';

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
      this.setScaleFactor(
        nextProps.scaleFactor,
        nextProps.displayWidth,
        this.state.scaleFactorMatrices
      );
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

        const scaleFactorMatrices = this.createAllScaleFactors(
          firstTileSet,
          width,
          height
        );
        this.setScaleFactor(scaleFactor, displayWidth, scaleFactorMatrices);
        this.setState({ scaleFactorMatrices });
      });
  }

  createAllScaleFactors(tileSet, width, height) {
    return tileSet.scaleFactors.map(scaleFactor => {
      const fullWidth = Math.ceil(width / scaleFactor);
      const fullHeight = Math.ceil(height / scaleFactor);

      const tilesX = Math.ceil(fullWidth / tileSet.width);
      const tilesY = Math.ceil(fullHeight / tileSet.height);

      const matrix = math.zeros(tilesX, tilesY, 5).map((value, [x, y, z]) => {
        const rx = x * tileSet.width;
        const ry = y * tileSet.height;
        switch (z) {
          // x
          case 0:
            return rx;
          // y
          case 1:
            return ry;
          // height
          case 2:
            return rx + tileSet.width < fullWidth
              ? tileSet.width
              : fullWidth - rx;
          // width
          case 3:
            return ry + tileSet.height < fullHeight
              ? tileSet.height
              : fullHeight - ry;
          // Should render
          case 4:
            return 1;
        }
      });

      return {
        scaleFactor,
        matrix,
        fullHeight,
        fullWidth,
        tilesX,
        tilesY,
      };
    });
  }

  setScaleFactor(scaleFactorIndex, displayWidth, scaleFactorMatrices) {
    const { matrix, fullHeight, fullWidth, scaleFactor } =
      typeof scaleFactorMatrices[scaleFactorIndex] !== 'undefined'
        ? scaleFactorMatrices[scaleFactorIndex]
        : scaleFactorMatrices[scaleFactorMatrices.length - 1];

    this.setState({
      currentScaleFactor: scaleFactor,
      currentWidth: fullWidth,
      currentHeight: fullHeight,
      matrix,
    });
  }

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
      currentWidth,
      currentHeight,
      currentScaleFactor,
    } = this.state;
    const { children, scaleFactor, displayWidth } = this.props;

    const imageResourceMatrix = scale(currentScaleFactor).transform(matrix);

    return children({
      id,
      scaleFactors,
      scaleFactor,
      currentWidth,
      currentHeight,
      currentScaleFactor,
      displayWidth,
      displayHeight: currentHeight
        ? currentHeight * (displayWidth / currentWidth)
        : 0,
      matrix,
      imageResourceMatrix,
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
