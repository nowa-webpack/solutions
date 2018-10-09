const path = require('path');

const baseBuildOptions = {
  entry: { type: 'string', description: 'entry file path', default: './src/index.jsx' },
  outputPath: { type: 'string', description: 'build path', default: './build/' },
  browsers: {
    type: 'string',
    description: 'target browsers',
    default: '>= 1%, not ie < 9, not chrome < 40, not safari < 8, not iOS < 8, not Android < 40',
  },
  publicPath: { type: 'string', description: 'webpack publicPath', default: '' },
  noBabelConfig: { type: 'boolean', description: 'babel-loader with empty config', default: false },
  cssModules: { type: 'boolean', description: 'enable css modules', default: false },
};

module.exports = /** @type {import(@nowa/core).Types.ISolution} */ ({
  commands: {
    build: {
      default: 'prod',
      dev: [
        Object.assign({}, baseBuildOptions, {
          profile: { type: 'boolean', description: 'output webpack profile', default: false },
        }),
        [
          ['file', ({ options }) => ({ type: 'empty', from: options.outputPath })],
          ['webpack', path.resolve(__dirname, './webpack/dev.build.js')],
        ],
        '开发环境构建',
      ],
      prod: [
        Object.assign({}, baseBuildOptions, {
          supportIE8: { type: 'boolean', description: 'minify support ie8', default: false },
          compileNodeModules: { type: 'boolean', description: 'compile js files in node_modules', default: true },
          profile: { type: 'boolean', description: 'output webpack profile', default: false },
          dropConsole: { type: 'boolean', description: 'drop console.* in uglify', default: true },
        }),
        [
          ['file', ({ options }) => ({ type: 'empty', from: options.outputPath })],
          ['webpack', path.resolve(__dirname, './webpack/prod.js')],
        ],
        '生产环境构建',
      ],
    },
    server: [
      Object.assign({}, baseBuildOptions, {
        port: { type: 'number', description: 'server port', default: 8080 },
        hot: { type: 'boolean', description: 'enable hotModuleReplacement', default: false },
      }),
      [['webpack', path.resolve(__dirname, './webpack/dev.server.js')]],
      '启动开发服务器',
    ],
  },
  help: {
    build: {
      _label: '构建项目',
      _default: 'prod',
      dev: '开发环境构建',
      prod: '生产环境构建',
    },
    server: '启动开发服务器',
  },
});
