const autoprefixer = require('autoprefixer');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const merge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const base = require('./base');

module.exports = arg =>
  merge(base(arg), {
    mode: 'development',

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { modules: arg.options.cssModules, importLoaders: 1 },
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
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { modules: arg.options.cssModules, importLoaders: 1 },
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

    plugins: [
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify('dev'),
      }),
    ],

    performance: {
      hints: false,
    },
  });
