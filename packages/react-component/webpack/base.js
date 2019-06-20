const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = ({ context, options }) => {
  const packageJSON = require(path.resolve(context, './package.json')); // eslint-disable-line
  return {
    context,
    entry: {
      [path
        .basename(options.entry)
        .split('.')
        .slice(0, -1)
        .join('.')]: options.entry,
    },
    module: {
      rules: [],
    },
    output: {
      path: path.resolve(context, options.outputPath),
      filename: '[name].js',
      chunkFilename: '[name].js',
      crossOriginLoading: 'anonymous',
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(en|zh-cn)/),
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(packageJSON.version || '0.0.1'),
      }),
    ],
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(context, './tsconfig.json'),
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          silent: true,
        }),
      ],
    },
    target: 'web',
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
