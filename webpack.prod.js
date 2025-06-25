const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'public/_redirects'), to: '' },
        {
          from: path.resolve(__dirname, 'node_modules/workbox-webpack-plugin/build/workbox-*.js'),
          to: '[name][ext]',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/workbox-window.*'], 
          },
        },
        {
          from: path.resolve(__dirname, 'node_modules/workbox-core'),
          to: 'workbox-core',
        },
        {
          from: path.resolve(__dirname, 'node_modules/workbox-routing'),
          to: 'workbox-routing',
        },
        {
          from: path.resolve(__dirname, 'node_modules/workbox-strategies'),
          to: 'workbox-strategies',
        },
        {
          from: path.resolve(__dirname, 'node_modules/workbox-precaching'),
          to: 'workbox-precaching',
        },
      ],
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: ({request}) => request.destination === 'document',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'html-cache',
          },
        },
        {
          urlPattern: ({request}) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          },
        },
        {
          urlPattern: ({url}) => url.origin === 'https://story-api.dicoding.dev',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
          },
        },
      ],
    }),
  ],
});
