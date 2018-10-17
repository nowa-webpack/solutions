const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./base');

module.exports = arg =>
  merge(base(arg), {
    mode: 'development',

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: path.resolve(arg.context, './src'),
          loader: 'babel-loader',
          options: arg.options.noBabelConfig
            ? {}
            : {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: arg.options.browsers,
                      modules: false,
                      loose: true,
                      useBuiltIns: 'entry',
                      configPath: arg.context,
                      shippedProposals: true,
                    },
                  ],
                  '@babel/preset-react',
                ],
                plugins: [
                  ['@babel/plugin-proposal-decorators', { legacy: true }],
                  ['@babel/plugin-proposal-class-properties', { loose: true }],
                  '@babel/plugin-proposal-export-default-from',
                  '@babel/plugin-proposal-export-namespace-from',
                  '@babel/plugin-proposal-optional-chaining',
                  '@babel/plugin-proposal-numeric-separator',
                  '@babel/plugin-proposal-throw-expressions',
                  '@babel/plugin-syntax-dynamic-import',
                ],
              },
        },
        {
          test: /\.css$/,
          oneOf: [
            {
              exclude: /node_modules/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: { modules: arg.options.cssModules, camelCase: 'only', importLoaders: 1 },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [autoprefixer({ browsers: arg.options.browsers })],
                  },
                },
              ],
            },
            {
              include: /node_modules/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: { importLoaders: 1 },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [autoprefixer({ browsers: arg.options.browsers })],
                  },
                },
              ],
            },
          ],
        },
        {
          test: /\.less$/,
          oneOf: [
            {
              exclude: /node_modules/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: { modules: arg.options.cssModules, camelCase: 'only', importLoaders: 1 },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [autoprefixer({ browsers: arg.options.browsers })],
                  },
                },
                'less-loader',
              ],
            },
            {
              include: /node_modules/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: { importLoaders: 1 },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [autoprefixer({ browsers: arg.options.browsers })],
                  },
                },
                'less-loader',
              ],
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify('dev'),
      }),
    ],

    performance: {
      hints: false,
    },
  });
