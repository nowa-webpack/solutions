const path = require('path');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const base = require('./base');

module.exports = arg => {
  const baseConfig = base(arg);
  const locale = arg.options.locale[1];

  return merge(baseConfig, {
    bail: true,
    output: {
      filename: `[name]${locale ? `-${locale}` : ''}.js`,
    },
    mode: 'production',

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: arg.options.compileNodeModules
            ? [path.resolve(arg.context, './src'), path.resolve(arg.context, './node-modules')]
            : path.resolve(arg.context, './src'),
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
          use: 'null-loader',
        },
        {
          test: /\.less$/,
          use: 'null-loader',
        },
      ],
    },

    optimization: {
      minimizer:
        (!arg.options.skipMinify && [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false,
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
        ]) ||
        [],
      splitChunks: {
        chunks: 'all',
        name: 'common',
      },
    },
    stats: {
      chunks: false,
      children: false,
      entrypoints: false,
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify('prod'),
        __LOCAL__: JSON.stringify(false),
        __LANGUAGE__: JSON.stringify(arg.options.locale[1]),
      }),
      new webpack.ProgressPlugin(),
    ].filter(Boolean),
  });
};
