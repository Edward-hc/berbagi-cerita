const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 9000,
    hot: false,
    liveReload: true,
    open: true,
    proxy: [
      {
        context: ['/v1'],
        target: 'https://story-api.dicoding.dev',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/v1': '/v1' },
      },
    ],
  },
});
