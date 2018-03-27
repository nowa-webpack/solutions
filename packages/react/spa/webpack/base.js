const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const webpack = require('webpack');

module.exports = ({ context, options }) => {
  const packageJSON = require(path.resolve(context, './package.json')); // eslint-disable-line
  return {
    entry: {
      [path
        .basename(options.entry)
        .split('.')
        .slice(0, -1)
        .join('.')]: options.entry,
    },
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
                        browsers: [...options.browsers],
                      },
                      modules: false,
                      spec: true,
                      useBuiltIns: true,
                    },
                  ],
                  require.resolve('babel-preset-stage-2'),
                  require.resolve('babel-preset-react'),
                ],
                plugins: [require.resolve('babel-plugin-transform-decorators')],
              },
        },
        {
          test: /\.svg$/,
          loader: 'svg-react-loader',
          options: {
            name: 'SVGReactComponent'
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
      new ModuleScopePlugin(path.resolve(context, './src'), [path.resolve(context, './package.json')]),
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
