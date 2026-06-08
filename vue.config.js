const CompressionPlugin = require('compression-webpack-plugin');
const os = require('os');

const isProduction = process.env.NODE_ENV === 'production';

const productionPlugins = isProduction
  ? [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      }),
    ]
  : [];

module.exports = {
  productionSourceMap: false,
  lintOnSave: isProduction ? false : 'warning',
  transpileDependencies: ['vue-draggable-next'],
  parallel: os.cpus().length > 1,
  devServer: {
    host: '192.168.1.88',
    port: 9990,
    overlay: {
      warning: false,
      errors: false,
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
    plugins: productionPlugins,
    performance: {
      hints: isProduction ? 'warning' : false,
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    },
  },
  publicPath: './',
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');

    config.plugin('html').tap((args) => {
      args[0].title = '智慧安全系统';
      return args;
    });

    config.optimization.splitChunks({
      chunks: 'all',
      maxInitialRequests: 20,
      maxAsyncRequests: 20,
      minSize: 20000,
      cacheGroups: {
        echarts: {
          name: 'chunk-echarts',
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
          priority: 30,
          reuseExistingChunk: true,
        },
        three: {
          name: 'chunk-three',
          test: /[\\/]node_modules[\\/](three|three-orbitcontrols-ts)[\\/]/,
          priority: 30,
          reuseExistingChunk: true,
        },
        elementPlus: {
          name: 'chunk-element-plus',
          test: /[\\/]node_modules[\\/]element-plus[\\/]/,
          priority: 30,
          reuseExistingChunk: true,
        },
        xlsx: {
          name: 'chunk-xlsx',
          test: /[\\/]node_modules[\\/]xlsx[\\/]/,
          priority: 30,
          reuseExistingChunk: true,
        },
        videojs: {
          name: 'chunk-video',
          test: /[\\/]node_modules[\\/](video\.js|videojs-contrib-hls|dplayer|hls\.js|@videojs)[\\/]/,
          priority: 25,
          reuseExistingChunk: true,
        },
        mathjs: {
          name: 'chunk-mathjs',
          test: /[\\/]node_modules[\\/]mathjs[\\/]/,
          priority: 25,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    });

    if (isProduction) {
      config.optimization.minimize(true);
      config.optimization.minimizer('terser').tap((args) => {
        args[0].parallel = os.cpus().length > 1;
        args[0].extractComments = false;
        return args;
      });
    }
  },
};
