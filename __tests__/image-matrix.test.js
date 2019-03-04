import { buildFromResource } from '../src/image-matrix';

describe('image-matrix', () => {
  describe('buildFromResource', () => {
    const createFakeResource = (height, width, tile) => ({
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': 'https://view.nls.uk/iiif/7443/74438561.5',
      protocol: 'http://iiif.io/api/image',
      width,
      height,
      tiles: [tile],
    });

    test('simple 2x2 tiles', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      expect(scaleFactors.scaleFactorMatrices[0].matrix.valueOf()).toEqual([
        [
          // Row 1
          [0, 0, 256, 256, 1],
          [0, 256, 256, 256, 1],
        ],
        [
          // Row 2
          [256, 0, 256, 256, 1],
          [256, 256, 256, 256, 1],
        ],
      ]);
      expect(scaleFactors.scaleFactorMatrices[0].matrix.valueOf()).toEqual([
        [
          // Row 1
          [0, 0, 256, 256, 1],
          [0, 256, 256, 256, 1],
        ],
        [
          // Row 2
          [256, 0, 256, 256, 1],
          [256, 256, 256, 256, 1],
        ],
      ]);
    });

    test('simple 2x2 tiles with some trimmed', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(400, 400, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2],
        })
      );

      expect(scaleFactors.scaleFactorMatrices[0].matrix.valueOf()).toEqual([
        [
          // Row 1
          [0, 0, 256, 256, 1],
          [0, 256, 256, 144, 1],
        ],
        [
          // Row 2
          [256, 0, 144, 256, 1],
          [256, 256, 144, 144, 1],
        ],
      ]);
      expect(scaleFactors.scaleFactorMatrices[1].matrix.valueOf()).toEqual([
        [
          // Row 1
          [0, 0, 200, 200, 1],
        ],
      ]);
    });

    test('simple 2x2 tiles with 3 scale factors', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(512, 512, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2, 4],
        })
      );

      expect(scaleFactors.scaleFactorMatrices[0].matrix.valueOf()).toEqual([
        [
          // Row 1
          [0, 0, 256, 256, 1],
          [0, 256, 256, 256, 1],
        ],
        [
          // Row 2
          [256, 0, 256, 256, 1],
          [256, 256, 256, 256, 1],
        ],
      ]);
      expect(scaleFactors.scaleFactorMatrices[1].matrix.valueOf()).toEqual([
        [
          // Row 1
          [0, 0, 256, 256, 1],
        ],
      ]);
      expect(scaleFactors.scaleFactorMatrices[2].matrix.valueOf()).toEqual([
        [
          // Row 1
          [0, 0, 128, 128, 1],
        ],
      ]);
    });

    test('non-normal 2x3 tiles with 3 scale factors', () => {
      const scaleFactors = buildFromResource(
        createFakeResource(2000, 3000, {
          width: 256,
          height: 256,
          scaleFactors: [1, 2, 4, 8],
        })
      );

      // This first scale, 1 to 1, maps to 2000x3000 of images split into:
      // - 8 rows
      // - 12 columns
      expect(scaleFactors.scaleFactorMatrices[0].matrix.valueOf()).toEqual([
        [
          [0, 0, 256, 256, 1],
          [0, 256, 256, 256, 1],
          [0, 512, 256, 256, 1],
          [0, 768, 256, 256, 1],
          [0, 1024, 256, 256, 1],
          [0, 1280, 256, 256, 1],
          [0, 1536, 256, 256, 1],
          [0, 1792, 256, 208, 1],
        ],
        [
          [256, 0, 256, 256, 1],
          [256, 256, 256, 256, 1],
          [256, 512, 256, 256, 1],
          [256, 768, 256, 256, 1],
          [256, 1024, 256, 256, 1],
          [256, 1280, 256, 256, 1],
          [256, 1536, 256, 256, 1],
          [256, 1792, 256, 208, 1],
        ],
        [
          [512, 0, 256, 256, 1],
          [512, 256, 256, 256, 1],
          [512, 512, 256, 256, 1],
          [512, 768, 256, 256, 1],
          [512, 1024, 256, 256, 1],
          [512, 1280, 256, 256, 1],
          [512, 1536, 256, 256, 1],
          [512, 1792, 256, 208, 1],
        ],
        [
          [768, 0, 256, 256, 1],
          [768, 256, 256, 256, 1],
          [768, 512, 256, 256, 1],
          [768, 768, 256, 256, 1],
          [768, 1024, 256, 256, 1],
          [768, 1280, 256, 256, 1],
          [768, 1536, 256, 256, 1],
          [768, 1792, 256, 208, 1],
        ],
        [
          [1024, 0, 256, 256, 1],
          [1024, 256, 256, 256, 1],
          [1024, 512, 256, 256, 1],
          [1024, 768, 256, 256, 1],
          [1024, 1024, 256, 256, 1],
          [1024, 1280, 256, 256, 1],
          [1024, 1536, 256, 256, 1],
          [1024, 1792, 256, 208, 1],
        ],
        [
          [1280, 0, 256, 256, 1],
          [1280, 256, 256, 256, 1],
          [1280, 512, 256, 256, 1],
          [1280, 768, 256, 256, 1],
          [1280, 1024, 256, 256, 1],
          [1280, 1280, 256, 256, 1],
          [1280, 1536, 256, 256, 1],
          [1280, 1792, 256, 208, 1],
        ],
        [
          [1536, 0, 256, 256, 1],
          [1536, 256, 256, 256, 1],
          [1536, 512, 256, 256, 1],
          [1536, 768, 256, 256, 1],
          [1536, 1024, 256, 256, 1],
          [1536, 1280, 256, 256, 1],
          [1536, 1536, 256, 256, 1],
          [1536, 1792, 256, 208, 1],
        ],
        [
          [1792, 0, 256, 256, 1],
          [1792, 256, 256, 256, 1],
          [1792, 512, 256, 256, 1],
          [1792, 768, 256, 256, 1],
          [1792, 1024, 256, 256, 1],
          [1792, 1280, 256, 256, 1],
          [1792, 1536, 256, 256, 1],
          [1792, 1792, 256, 208, 1],
        ],
        [
          [2048, 0, 256, 256, 1],
          [2048, 256, 256, 256, 1],
          [2048, 512, 256, 256, 1],
          [2048, 768, 256, 256, 1],
          [2048, 1024, 256, 256, 1],
          [2048, 1280, 256, 256, 1],
          [2048, 1536, 256, 256, 1],
          [2048, 1792, 256, 208, 1],
        ],
        [
          [2304, 0, 256, 256, 1],
          [2304, 256, 256, 256, 1],
          [2304, 512, 256, 256, 1],
          [2304, 768, 256, 256, 1],
          [2304, 1024, 256, 256, 1],
          [2304, 1280, 256, 256, 1],
          [2304, 1536, 256, 256, 1],
          [2304, 1792, 256, 208, 1],
        ],
        [
          [2560, 0, 256, 256, 1],
          [2560, 256, 256, 256, 1],
          [2560, 512, 256, 256, 1],
          [2560, 768, 256, 256, 1],
          [2560, 1024, 256, 256, 1],
          [2560, 1280, 256, 256, 1],
          [2560, 1536, 256, 256, 1],
          [2560, 1792, 256, 208, 1],
        ],
        [
          [2816, 0, 184, 256, 1],
          [2816, 256, 184, 256, 1],
          [2816, 512, 184, 256, 1],
          [2816, 768, 184, 256, 1],
          [2816, 1024, 184, 256, 1],
          [2816, 1280, 184, 256, 1],
          [2816, 1536, 184, 256, 1],
          [2816, 1792, 184, 208, 1],
        ],
      ]);

      // The second scale, 2 to 1, maps 1000x1500 into images split into:
      // - 4 rows
      // - 6 columns
      expect(scaleFactors.scaleFactorMatrices[1].matrix.valueOf()).toEqual([
        [
          [0, 0, 256, 256, 1],
          [0, 256, 256, 256, 1],
          [0, 512, 256, 256, 1],
          [0, 768, 256, 232, 1],
        ],
        [
          [256, 0, 256, 256, 1],
          [256, 256, 256, 256, 1],
          [256, 512, 256, 256, 1],
          [256, 768, 256, 232, 1],
        ],
        [
          [512, 0, 256, 256, 1],
          [512, 256, 256, 256, 1],
          [512, 512, 256, 256, 1],
          [512, 768, 256, 232, 1],
        ],
        [
          [768, 0, 256, 256, 1],
          [768, 256, 256, 256, 1],
          [768, 512, 256, 256, 1],
          [768, 768, 256, 232, 1],
        ],
        [
          [1024, 0, 256, 256, 1],
          [1024, 256, 256, 256, 1],
          [1024, 512, 256, 256, 1],
          [1024, 768, 256, 232, 1],
        ],
        [
          [1280, 0, 220, 256, 1],
          [1280, 256, 220, 256, 1],
          [1280, 512, 220, 256, 1],
          [1280, 768, 220, 232, 1],
        ],
      ]);

      // The third scale, 4 to 1, maps 500x750 into images split into:
      // - 2 rows
      // - 3 columns
      expect(scaleFactors.scaleFactorMatrices[2].matrix.valueOf()).toEqual([
        [[0, 0, 256, 256, 1], [0, 256, 256, 244, 1]],
        [[256, 0, 256, 256, 1], [256, 256, 256, 244, 1]],
        [[512, 0, 238, 256, 1], [512, 256, 238, 244, 1]],
      ]);

      // The third scale, 8 to 1, maps 250x375 into images split into:
      // - 1 rows
      // - 2 columns
      expect(scaleFactors.scaleFactorMatrices[3].matrix.valueOf()).toEqual([
        [[0, 0, 256, 250, 1]],
        [[256, 0, 119, 250, 1]],
      ]);
    });
  });
});
