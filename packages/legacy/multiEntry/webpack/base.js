const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = ({ context, options }) => {
  const packageJSON = require(path.resolve(context, './package.json')); // eslint-disable-line
  const entry = (() => {
    const result = { app: path.resolve(context, './src/app/app.js') };
    const pagesPath = path.resolve(context, './src/pages/');
    fs.readdirSync(pagesPath).forEach(val => {
      const filePath = path.resolve(pagesPath, val);
      const jsFilePath = path.resolve(filePath, 'index.js');
      const jsxFilePath = path.resolve(filePath, 'index.jsx');
      result[val] = fs.existsSync(jsxFilePath) ? jsxFilePath : jsFilePath;
    });
    return result;
  })();
  const locale = options.locale[0];
  return {
    entry,
    externals: JSON.parse(options.externals) || {},
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: path.resolve(context, './src'),
          loader: 'babel-loader',
          options: options.babelrc
            ? { babelrc: true }
            : {
                babelrc: false,
                presets: [
                  [
                    require.resolve('babel-preset-env'),
                    {
                      targets: {
                        browsers: options.browsers,
                      },
                      modules: false,
                      spec: true,
                      useBuiltIns: true,
                    },
                  ],
                  require.resolve('babel-preset-stage-0'),
                  require.resolve('babel-preset-react'),
                ],
                plugins: [require.resolve('babel-plugin-transform-decorators-legacy'), ...JSON.parse(options.babelPlugins)],
              },
        },
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
      filename: `[name]${locale ? `-${locale}` : ''}.js`,
      chunkFilename: '[name].js',
      crossOriginLoading: 'anonymous',
      publicPath: options.publicPath,
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
      alias: JSON.parse(options.alias) || {},
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
