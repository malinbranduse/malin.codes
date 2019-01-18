// Defines which version to build
const dev = process.env.NODE_ENV !== 'production';

// Plugins used by webpack
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: [
    __dirname + "/assets/js/index.js"
  ],
  output: {
    // output file for production
    path: __dirname + "/assets/build/",
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.sass$/,
        loaders: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
            loader: "css-loader", options: {
              sourceMap: true
            }
          }, {
            loader: "sass-loader", options: {
              sourceMap: true
            }
          }]
        })
      }
    ],
  },
  plugins: [].concat(
    dev ? [
      new ExtractTextPlugin('styles.css'),
      new BrowserSyncPlugin({
        files: [ "**/*.hbs" ],
        host: 'localhost',
        port: 3000,
        proxy: 'localhost:2368'
      })
    ] : [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new ExtractTextPlugin('styles.css'),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        include: /\.js$/

      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/,
        cssProcessorOptions: { discardComments: { removeAll: true } }
      })
    ]
  ),
  devtool: dev ? "source-map" : false, // Create sourcemaps for css and js in development
  watch: dev, // Use webpacks watcher in development
  watchOptions: {
    aggregateTimeout: 500,
    poll: true
  }
};
