const packageConfig = require('./package');
require("babel-plugin-lodash");
require("babel-plugin-antd");
require("babel-plugin-typescript-to-proptypes");
require("@emotion/babel-preset-css-prop")
require("babel-plugin-jsx-remove-data-test-id")

module.exports = {
  sourceMaps: true,
  sourceType: 'module',
  retainLines: true,
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        loose: true,
        modules: false,
        shippedProposals: true,
        targets: packageConfig.browserslist,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
    '@emotion/babel-preset-css-prop',
  ],
  plugins: [
    'babel-plugin-lodash',
    'babel-plugin-antd',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-optional-chaining', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
    ['@babel/plugin-transform-runtime', { corejs: 3 }],
    ['babel-plugin-typescript-to-proptypes', { loose: true }],
    'react-hot-loader/babel',
    ["babel-plugin-jsx-remove-data-test-id", { "attributes": ["data-test-id"] }],
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
            loose: true,
            shippedProposals: true,
            modules: 'commonjs',
            targets: { node: 'current' },
          },
        ],
        '@emotion/babel-preset-css-prop',
      ],
      plugins: ['babel-plugin-dynamic-import-node'],
    },
    production: {
      plugins: [
        [
          'babel-plugin-jsx-remove-data-test-id',
          {
            attributes: 'data-test',
          },
        ],
      ],
    },
    testableProduction: {
      plugins: [],
    },
  }
};