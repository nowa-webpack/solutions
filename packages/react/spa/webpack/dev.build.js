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
          options: arg.options.babelrc
            ? { babelrc: true }
            : {
                babelrc: false,
                presets: [
                  [
                    require.resolve('babel-preset-env'),
                    {
                      targets: {
                        browsers: arg.options.browsers,
                      },
                      modules: false,
                      spec: true,
                      useBuiltIns: true,
                    },
                  ],
                  require.resolve('babel-preset-stage-2'),
                  require.resolve('babel-preset-react'),
                ],
                plugins: [require.resolve('babel-plugin-transform-decorators-legacy')],
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
