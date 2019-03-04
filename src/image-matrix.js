import * as math from 'mathjs';

export function loadResource(resourceId) {
  return fetch(resourceId)
    .then(r => r.json())
    .then(buildFromResource);
}

export function getDisplayWidth({ currentHeight, displayWidth, currentWidth }) {
  return currentHeight ? currentHeight * (displayWidth / currentWidth) : 0;
}

export function createImage(imageResourceMatrix, rowId, cellId, tileWidth) {
  return makeIIIFResource({
    x: imageResourceMatrix.get([rowId, cellId, 0]),
    y: imageResourceMatrix.get([rowId, cellId, 1]),
    width: imageResourceMatrix.get([rowId, cellId, 2]),
    height: imageResourceMatrix.get([rowId, cellId, 3]),
    tileWidth,
  });
}

export function buildFromResource({ height, width, tiles, ...resp }) {
  const firstTileSet = tiles[0];
  if (!firstTileSet.height) {
    // noinspection JSSuspiciousNameCombination
    firstTileSet.height = firstTileSet.width;
  }

  return {
    id: resp['@id'] || resp.id,
    height,
    width,
    tileSet: firstTileSet,
    scaleFactors: firstTileSet.scaleFactors,
    scaleFactorMatrices: createAllScaleFactors(firstTileSet, width, height),
  };
}

export function createAllScaleFactors(tileSet, width, height) {
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

function makeIIIFResource({ x, y, width, height, region, tileWidth }) {
  return `${
    this.state.id
  }/${x},${y},${width},${height}/${tileWidth},/0/default.jpg`;
}
