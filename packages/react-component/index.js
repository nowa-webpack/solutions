const path = require('path');

const baseBuildOptions = {
  outputPath: { type: 'string', description: 'build path', default: './lib/' },
  browsers: {
    type: 'string',
    description: 'target browsers',
    default: ['iOS >= 7', 'Android >= 2.3', 'FireFoxAndroid >= 46', '> 1%'].join(','),
  },
  publicPath: { type: 'string', description: 'webpack publicPath', default: '' },
  noBabelConfig: { type: 'boolean', description: 'babel-loader with empty config', default: false },
  cssModules: { type: 'boolean', description: 'enable css modules', default: false },
};

module.exports = {
  commands: {
    build: {
      default: 'prod',
      dev: [
        Object.assign({}, baseBuildOptions, {
          entry: { type: 'string', description: 'entry file path', default: './src/index.tsx' },
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
          entry: { type: 'string', description: 'entry file path', default: './src/index.tsx' },
          supportIE8: { type: 'boolean', description: 'minify support ie8', default: false },
          compileNodeModules: { type: 'boolean', description: 'compile js files in node_modules', default: true },
          profile: { type: 'boolean', description: 'output webpack profile', default: false },
          dropConsole: { type: 'boolean', description: 'drop console.* in uglify', default: true },
          nodeExternalWhitelist: { type: 'array', description: 'whitelist for webpack-node-externals', default: [] },
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
        entry: { type: 'string', description: 'entry file path', default: './src/demo/index.tsx' },
        port: { type: 'number', description: 'server port', default: 8080 },
        hot: { type: 'boolean', description: 'enable hotModuleReplacement', default: false },
      }),
      [['webpack', path.resolve(__dirname, './webpack/dev.server.js')]],
      '启动开发服务器',
    ],
  },
  help: {
    build: '构建',
    server: '启动开发服务器',
  },
};
