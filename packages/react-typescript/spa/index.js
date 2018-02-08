// import { Types } from '@nowa/core';
const path = require('path');

const baseBuildOptions = {
  entry: { type: 'string', description: 'entry file path', default: './src/index.tsx' },
  outputPath: { type: 'string', description: 'build path', default: './build/' },
  browsers: { type: 'array', description: 'target browsers', default: ['ie >= 9'] },
  publicPath: { type: 'string', description: 'webpack publicPath', default: '' },
};

module.exports = /** @type {Types.ISolution} */ ({
  commands: {
    build: {
      default: 'prod',
      dev: [
        baseBuildOptions,
        [
          ['file', ({ options }) => ({ type: 'empty', from: options.outputPath })],
          ['webpack', path.resolve(__dirname, './webpack/dev.build.js')],
        ],
        '开发环境构建',
      ],
      prod: [
        Object.assign({}, baseBuildOptions, {
          supportIE8: { type: 'boolean', description: 'minify support ie8', default: false },
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
    build: '项目构建',
    server: '开发服务器',
  },
});
