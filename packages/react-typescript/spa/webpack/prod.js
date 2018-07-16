const autoprefixer = require('autoprefixer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line import/no-extraneous-dependencies
const merge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies

const base = require('./base');

module.exports = arg =>
  merge(base(arg), {
    bail: true,

    mode: 'production',

    module: {
      rules: [
        {
          test: /\.css$/,
          oneOf: [
            {
              exclude: /node_modules/,
              use: [
                MiniCssExtractPlugin.loader,
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
              use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
          ],
        },
        {
          test: /\.less$/,
          oneOf: [
            {
              exclude: /node_modules/,
              use: [
                MiniCssExtractPlugin.loader,
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
                MiniCssExtractPlugin.loader,
                'css-loader',
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

    optimization: {
      minimizer: [
        new UglifyJsPlugin({
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
        new OptimizeCSSAssetsPlugin({}),
      ],
    },

    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        logLevel: 'warn',
        reportFilename: 'bundle-report.html',
      }),
      new CaseSensitivePathsPlugin(),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify('prod'),
      }),
      arg.options.profile && new webpack.debug.ProfilingPlugin(),
    ].filter(Boolean),
  });
