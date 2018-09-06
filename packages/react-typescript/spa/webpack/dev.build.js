const path = require('path');

const autoprefixer = require('autoprefixer'); // eslint-disable-line import/no-extraneous-dependencies
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const merge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const base = require('./base');

const babelLoaderOption = options =>
  options.babelrc
    ? { babelrc: true }
    : {
        babelrc: false,
        presets: [
          [
            require.resolve('babel-preset-env'),
            {
              targets: {
                browsers: options.browsers,
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
      };

module.exports = arg =>
  merge(base(arg), {
    mode: 'development',

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: path.resolve(arg.context, './src'),
          use: [
            {
              loader: 'babel-loader',
              options: babelLoaderOption(arg.options),
            },
            {
              loader: 'ts-loader',
              options: {
                onlyCompileBundledFiles: true,
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          include: path.resolve(arg.context, './src'),
          loader: 'babel-loader',
          options: babelLoaderOption(arg.options),
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
