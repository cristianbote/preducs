const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

var devtool = 'source-map';

const entry = {
    app: './src/index.js',
    vendor: [ 'react', 'react-dom' ]
};

const output = {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
};

const modules = {
    loaders: [
        { test: /\.html/, loader: 'file-loader' },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
            query: {
                plugins: [ 'babel-plugin-transform-object-rest-spread' ],
                presets: [ 'env', 'react' ]
            }
        }
    ]
};

const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.bundle.js'
    }),
    new CopyPlugin([
        { from: path.resolve(__dirname, './src/index.html'), to: '.' }
    ])
];

const devServer = {
    historyApiFallback: {
        index: './src/index.html',
    },
    stats: 'minimal'
};

module.exports = {
    devtool,
    entry,
    output,
    module: modules,
    plugins,
    devServer
};