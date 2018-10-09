const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const getEntry = (context, entryFolderPath) => {
  const fileList = fs.readdirSync(path.resolve(context, entryFolderPath));
  const result = {};
  fileList.forEach(folderName => {
    if (folderName.slice(-4) === '.jsx') {
      result[folderName] = `./${path.relative(context, path.resolve(context, entryFolderPath, folderName))}`;
    } else {
      result[folderName] = `./${path.relative(context, path.resolve(context, entryFolderPath, folderName, 'index.jsx'))}`;
    }
  });
  return result;
};

module.exports = ({ context, options }) => {
  const packageJSON = require(path.resolve(context, './package.json')); // eslint-disable-line
  return {
    context,
    entry: getEntry(context, options.entryFolder),
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'svg-react-loader',
          options: {
            name: 'SVGReactComponent',
          },
        },
        {
          test: /\.(png|jpe?g|gif|woff|woff2|ttf|otf)$/,
          loader: 'url-loader',
          options: {
            limit: 10240,
          },
        },
      ],
    },
    output: {
      path: path.resolve(context, options.outputPath),
      filename: '[name].js',
      chunkFilename: '[name].[chunkhash].js',
      crossOriginLoading: 'anonymous',
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(en|zh-cn)/),
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(packageJSON.version || '0.0.1'),
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
    ],
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json'],
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
