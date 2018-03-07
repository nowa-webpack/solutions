const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line import/no-extraneous-dependencies
const merge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies

const base = require('./base');

module.exports = arg =>
  merge(base(arg), {
    bail: true,

    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                },
              },
            ],
            fallback: 'style-loader',
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                },
              },
              'less-loader',
            ],
            fallback: 'style-loader',
          }),
        },
      ],
    },

    devtool: 'source-map',

    plugins: [
      new CaseSensitivePathsPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.HashedModuleIdsPlugin(),
      new UglifyJsPlugin({
        test: /\.js($|\?)/i,
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          ie8: arg.options.supportIE8,
          ecma: 8,
          warnings: true,
          compress: {
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebookincubator/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
          },
          mangle: {
            safari10: true,
          },
          output: {
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebookincubator/create-react-app/issues/2488
            ascii_only: true,
          },
        },
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        logLevel: 'warn',
        reportFilename: 'bundle-report.html',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        __ENV__: JSON.stringify('prod'),
      }),
      new ExtractTextPlugin('[name].css'),
    ],
  });
