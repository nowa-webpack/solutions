const path = require('path');

const autoprefixer = require('autoprefixer'); // eslint-disable-line import/no-extraneous-dependencies
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line import/no-extraneous-dependencies
const merge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies

const base = require('./base');

const babelLoaderOption = arg =>
  arg.options.noBabelConfig
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
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          '@babel/plugin-proposal-export-default-from',
          '@babel/plugin-proposal-export-namespace-from',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-numeric-separator',
          '@babel/plugin-proposal-throw-expressions',
          '@babel/plugin-syntax-dynamic-import',
        ],
      };

module.exports = arg =>
  merge(base(arg), {
    bail: true,

    mode: 'production',

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: path.resolve(arg.context, './src'),
          use: [
            {
              loader: 'babel-loader',
              options: babelLoaderOption(arg),
            },
            {
              loader: 'ts-loader',
              options: {
                onlyCompileBundledFiles: true,
                experimentalFileCaching: true,
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          include: arg.options.compileNodeModules
            ? [path.resolve(arg.context, './src'), path.resolve(arg.context, './node_modules')]
            : path.resolve(arg.context, './src'),
          loader: 'babel-loader',
          options: babelLoaderOption(arg),
        },
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
              use: [
                MiniCssExtractPlugin.loader,
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

    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            ie8: arg.options.supportIE8,
            warnings: true,
            compress: {
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebookincubator/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              drop_console: arg.options.dropConsole,
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
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true }, calc: false }],
          },
        }),
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
      new webpack.ProgressPlugin(),
      arg.options.profile && new webpack.debug.ProfilingPlugin(),
    ].filter(Boolean),
  });
