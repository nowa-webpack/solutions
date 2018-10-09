const fs = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

const getEntry = (context, entryFolderPath) => {
  const fileList = fs.readdirSync(path.resolve(context, entryFolderPath));
  const result = {};
  fileList.forEach(folderName => {
    if (folderName.slice(-4) === '.tsx') {
      result[folderName.slice(0, -4)] = `./${path.relative(context, path.resolve(context, entryFolderPath, folderName))}`;
    } else {
      result[folderName] = `./${path.relative(context, path.resolve(context, entryFolderPath, folderName, 'index.tsx'))}`;
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
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
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
