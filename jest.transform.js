module.exports = require('babel-jest').createTransformer({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8.11.0',
        },
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
  ],
});
