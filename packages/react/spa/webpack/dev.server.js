const webpack = require('webpack');
const merge = require('webpack-merge');

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

    plugins: [arg.options.hot && new webpack.HotModuleReplacementPlugin()].filter(Boolean),
  });
