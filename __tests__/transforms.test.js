import * as math from 'mathjs';
import { displayMatrix, scaleAtOrigin, translate } from '../src/transforms';
import { buildFromResource } from '../src/image-matrix';

describe('transforms', () => {
  const createFakeResource = (height, width, tile) => ({
    '@context': 'http://iiif.io/api/image/2/context.json',
    '@id': 'https://view.nls.uk/iiif/7443/74438561.5',
    protocol: 'http://iiif.io/api/image',
    width,
    height,
    tiles: [tile],
  });

  describe('displayMatrix', () => {
    test('simple 2x2 tiles', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      // Display for the first scale, the 1 to 1
      const transformer = displayMatrix(
        100,
        scaleFactors.scaleFactorMatrices[0].fullWidth
      );

      expect(scaleFactors.scaleFactorMatrices[0].fullWidth).toEqual(512);

      expect(
        transformer
          .transform(scaleFactors.scaleFactorMatrices[0].matrix)
          .valueOf()
      ).toEqual([
        [
          // Row 1.
          [0, 0, 50, 50, 0.1953125],
          [0, 50, 50, 50, 0.1953125],
        ],
        [
          // Row 2.
          [50, 0, 50, 50, 0.1953125],
          [50, 50, 50, 50, 0.1953125],
        ],
      ]);

      // Display for the first scale, the 2 to 1
      const transformer2 = displayMatrix(
        100,
        scaleFactors.scaleFactorMatrices[1].fullWidth
      );

      expect(scaleFactors.scaleFactorMatrices[1].fullWidth).toEqual(256);

      expect(
        transformer2
          .transform(scaleFactors.scaleFactorMatrices[1].matrix)
          .valueOf()
      ).toEqual([
        [
          // Row 1.
          [0, 0, 100, 100, 0.390625],
        ],
      ]);
    });
    test('simple 2x2 inverse', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      // Display for the first scale, the 1 to 1
      const transformer = displayMatrix(
        100,
        scaleFactors.scaleFactorMatrices[0].fullWidth
      );
      expect(
        transformer
          .inverse(
            transformer.transform(scaleFactors.scaleFactorMatrices[0].matrix)
          )
          .valueOf()
      ).toEqual(scaleFactors.scaleFactorMatrices[0].matrix.valueOf());

      // Display for the first scale, the 1 to 1
      const transformer1 = displayMatrix(
        100,
        scaleFactors.scaleFactorMatrices[1].fullWidth
      );
      expect(
        transformer1
          .inverse(
            transformer1.transform(scaleFactors.scaleFactorMatrices[1].matrix)
          )
          .valueOf()
      ).toEqual(scaleFactors.scaleFactorMatrices[1].matrix.valueOf());
    });
    test('simple 2x2 with larger size', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      // Display for the first scale, the 1 to 1
      const transformer = displayMatrix(
        890,
        scaleFactors.scaleFactorMatrices[0].fullWidth
      );

      expect(scaleFactors.scaleFactorMatrices[0].fullWidth).toEqual(512);

      // Note the scale is 1.73828125
      expect(
        transformer
          .transform(scaleFactors.scaleFactorMatrices[0].matrix)
          .valueOf()
      ).toEqual([
        [[0, 0, 445, 445, 1.73828125], [0, 445, 445, 445, 1.73828125]],
        [[445, 0, 445, 445, 1.73828125], [445, 445, 445, 445, 1.73828125]],
      ]);
    });
  });

  describe('translate', () => {
    test('simple 2x2 tiles, translated x: +100', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      const transformer = translate(100, 0);

      expect(scaleFactors.scaleFactorMatrices[0].fullWidth).toEqual(512);

      expect(
        transformer
          .transform(scaleFactors.scaleFactorMatrices[0].matrix)
          .valueOf()
      ).toEqual([
        [[100, 0, 256, 256, 1], [100, 256, 256, 256, 1]],
        [[356, 0, 256, 256, 1], [356, 256, 256, 256, 1]],
      ]);

      expect(
        transformer
          .inverse(
            transformer.transform(scaleFactors.scaleFactorMatrices[0].matrix)
          )
          .valueOf()
      ).toEqual(scaleFactors.scaleFactorMatrices[0].matrix.valueOf());
    });

    test('simple 2x2 tiles, translated x: -100', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      const transformer = translate(-100, 0);

      expect(scaleFactors.scaleFactorMatrices[0].fullWidth).toEqual(512);

      expect(
        transformer
          .transform(scaleFactors.scaleFactorMatrices[0].matrix)
          .valueOf()
      ).toEqual([
        [[-100, 0, 256, 256, 1], [-100, 256, 256, 256, 1]],
        [[156, 0, 256, 256, 1], [156, 256, 256, 256, 1]],
      ]);

      expect(
        transformer
          .inverse(
            transformer.transform(scaleFactors.scaleFactorMatrices[0].matrix)
          )
          .valueOf()
      ).toEqual(scaleFactors.scaleFactorMatrices[0].matrix.valueOf());
    });

    test('simple 2x2 tiles, translated y: +100', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      const transformer = translate(0, 100);

      expect(scaleFactors.scaleFactorMatrices[0].fullWidth).toEqual(512);

      expect(
        transformer
          .transform(scaleFactors.scaleFactorMatrices[0].matrix)
          .valueOf()
      ).toEqual([
        [[0, 100, 256, 256, 1], [0, 356, 256, 256, 1]],
        [[256, 100, 256, 256, 1], [256, 356, 256, 256, 1]],
      ]);

      expect(
        transformer
          .inverse(
            transformer.transform(scaleFactors.scaleFactorMatrices[0].matrix)
          )
          .valueOf()
      ).toEqual(scaleFactors.scaleFactorMatrices[0].matrix.valueOf());
    });

    test('simple 2x2 tiles, translated y: -100', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      const transformer = translate(0, -100);

      expect(scaleFactors.scaleFactorMatrices[0].fullWidth).toEqual(512);

      expect(
        transformer
          .transform(scaleFactors.scaleFactorMatrices[0].matrix)
          .valueOf()
      ).toEqual([
        [[0, -100, 256, 256, 1], [0, 156, 256, 256, 1]],
        [[256, -100, 256, 256, 1], [256, 156, 256, 256, 1]],
      ]);

      expect(
        transformer
          .inverse(
            transformer.transform(scaleFactors.scaleFactorMatrices[0].matrix)
          )
          .valueOf()
      ).toEqual(scaleFactors.scaleFactorMatrices[0].matrix.valueOf());
    });
  });

  describe('scaleAtOrigin', () => {
    test('scaleAtOrigin works by 2 at 50,50', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      const transformer = scaleAtOrigin(2, { x: 50, y: 50 });

      expect(scaleFactors.scaleFactorMatrices[0].fullWidth).toEqual(512);

      expect(
        transformer
          .transform(scaleFactors.scaleFactorMatrices[0].matrix)
          .valueOf()
      ).toEqual([
        [[100, 100, 512, 512, 2], [100, 612, 512, 512, 2]],
        [[612, 100, 512, 512, 2], [612, 612, 512, 512, 2]],
      ]);

      expect(
        transformer
          .inverse(
            transformer.transform(scaleFactors.scaleFactorMatrices[0].matrix)
          )
          .valueOf()
      ).toEqual(scaleFactors.scaleFactorMatrices[0].matrix.valueOf());
    });
  });
});
