const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const base = require('./dev.build');

module.exports = arg =>
  merge(base(arg), {
    devServer: {
      publicPath: '/',
      compress: true,
      historyApiFallback: false,
      hot: arg.options.hot,
      https: false,
      headers: { 'Access-Control-Allow-Origin': '*' },
      port: arg.options.port === 8080 ? undefined : arg.options.port,
      open: true,
    },

    plugins: [
      arg.options.hot && new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        title: 'Nowa Dev Server',
        template: path.resolve(arg.context, './src/index.ejs'),
      }),
      new WatchMissingNodeModulesPlugin(),
    ].filter(Boolean),
  });
