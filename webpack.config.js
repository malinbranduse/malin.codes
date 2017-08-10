// Defines which version to build
var dev = process.env.NODE_ENV !== 'production';

// Plugins used by webpack
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {

    entry: [
        __dirname + "/assets/js/index.js"
    ],
    output: dev ? {

        // output file for development
        path: __dirname + "/assets/build",
        filename: "index.js"

    } : {

        // output file for production
        path: __dirname + "/assets/build/",
        filename: "index.min.js"

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

    plugins: [

        // General plugins (dev + production)

    ].concat(
        dev ? [

            // Plugins used for development

            new ExtractTextPlugin('styles.css'),
            new BrowserSyncPlugin({

                files: [
                    "**/*.hbs",
                ],
                host: 'localhost',
                port: 3000,
                proxy: 'localhost:2368'

            })
        ] : [
            // Plugins used for production

            new webpack.optimize.ModuleConcatenationPlugin(),

            new ExtractTextPlugin('styles.min.css'),

            new webpack.optimize.UglifyJsPlugin({

                compress: { warnings: false },
                include: /\.min\.js$/

            }),

            new OptimizeCssAssetsPlugin({

                assetNameRegExp: /\.min\.css$/,
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
}
