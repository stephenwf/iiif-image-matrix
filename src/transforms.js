export const displayMatrix = (displayWidth, fullWidth) => ({
  transform: m =>
    m.map(value => {
      return value * (displayWidth / fullWidth);
    }),
  inverse: m =>
    m.map(value => {
      return value / (displayWidth / fullWidth);
    }),
});

export const inverse = transformer => ({
  transform: transformer.inverse,
  inverse: transformer.transform,
});

export const translate = (x, y) => ({
  transform: matrix =>
    matrix.map((value, [x1, y1, v]) => {
      switch (v) {
        case 0: // x
          return value + x;
        case 1: // y
          return value + y;
        default:
          return value;
      }
    }),
  inverse: matrix =>
    matrix.map((value, [x1, y1, v]) => {
      switch (v) {
        case 0: // x
          return value - x;
        case 1: // y
          return value - y;
        default:
          return value;
      }
    }),
});

export const filter = (x, y, width, height, padding = 0) => ({
  transform: matrix =>
    matrix.map((value, [x1, y1, v]) => {
      switch (v) {
        case 4: // should render
          const rx = matrix.get([x1, y1, 0]);
          const ry = matrix.get([x1, y1, 1]);
          const rw = matrix.get([x1, y1, 2]);
          const rh = matrix.get([x1, y1, 3]);
          if (
            rx + rw < x - padding ||
            rx > x + padding + width ||
            ry + rh < y - padding ||
            ry > y + padding + height
          ) {
            return 0;
          }
          return 1;
        default:
          return value;
      }
    }),
  inverse: matrix =>
    matrix.map((value, [x1, y1, v]) => {
      switch (v) {
        case 4: // should render
          return 1;
        default:
          return value;
      }
    }),
});

export const compose = (...transforms) => ({
  transform: matrix => {
    return transforms.reduce(
      (result, nextTransform) => nextTransform.transform(result),
      matrix
    );
  },
  inverse: matrix => {
    return this.transforms.reduceRight(
      (result, nextTransform) => nextTransform.inverse(result),
      matrix
    );
  },
});

export const scale = factor => ({
  transform: matrix => matrix.map(value => value * factor),
  inverse: matrix => matrix.map(value => value / factor),
});
