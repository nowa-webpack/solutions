const path = require('path');

const baseBuildOptions = {
  entry: {
    type: 'string',
    description: 'entry file path',
    default: './src/index.js',
  },
  outputPath: {
    type: 'string',
    description: 'build path',
    default: './build/',
  },
  browsers: {
    type: 'string',
    description: 'target browsers',
    default: '>= 1%, not ie < 9, not chrome < 40, not safari < 8, not iOS < 8, not Android < 40',
  },
  publicPath: {
    type: 'string',
    description: 'webpack publicPath',
    default: '',
  },
  babelrc: {
    type: 'boolean',
    description: 'babel-loader respect .babelrc',
    default: false,
  },
  externals: {
    type: 'string',
    description: 'webpack externals',
    default: '{}',
  },
  alias: {
    type: 'string',
    description: 'webpack resolve.alias',
    default: '{}',
  },
  skipMinify: { type: 'boolean', description: 'skip uglify', default: false },
  locale: { type: 'array', description: 'locales, maximum 2', default: ['zh-cn', 'en'] },
  babelPlugins: { type: 'string', description: 'babel plugins config', default: '[]' },
};

module.exports = /** @type {import('@nowa/core').Types.ISolution} */ ({
  commands: {
    build: [
      Object.assign({}, baseBuildOptions, {
        supportIE8: {
          type: 'boolean',
          description: 'minify support ie8',
          default: false,
        },
        profile: {
          type: 'boolean',
          description: 'output webpack profile',
          default: false,
        },
      }),
      [
        ['file', ({ options }) => ({ type: 'empty', from: options.outputPath })],
        [
          'file',
          ({ context, options }) => ({
            type: 'copy',
            from: path.resolve(context, 'html'),
            to: `${options.outputPath}${options.outputPath.slice(-1) === '/' ? '' : '/'}`,
          }),
        ],
        [
          'file',
          ({ context, options }) => ({
            type: 'copy',
            from: path.resolve(context, 'src/lib'),
            to: `${options.outputPath}${options.outputPath.slice(-1) === '/' ? '' : '/'}`,
          }),
        ],
        ({ options }) => (options.locale.length > 1 ? ['webpack', path.resolve(__dirname, './webpack/prodOL.js')] : undefined),
        ['webpack', path.resolve(__dirname, './webpack/prod.js')],
      ],
      '生产环境构建',
    ],
    server: [
      Object.assign({}, baseBuildOptions, {
        port: { type: 'number', description: 'server port', default: 8080 },
        https: { type: 'boolean', description: 'enable https', default: false },
        hot: {
          type: 'boolean',
          description: 'enable hotModuleReplacement',
          default: false,
        },
      }),
      [
        ['file', ({ context, options }) => ({ type: 'copy', from: path.resolve(context, 'html'), to: options.outputPath })],
        ['file', ({ context, options }) => ({ type: 'copy', from: path.resolve(context, 'src/lib'), to: options.outputPath })],
        ['webpack', path.resolve(__dirname, './webpack/dev.server.js')],
      ],
      '启动开发服务器',
    ],
  },
  help: {
    build: '构建项目',
    server: '启动开发服务器',
  },
});
