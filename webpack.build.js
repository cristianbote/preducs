const path = require('path');
const webpack = require('webpack');

var devtool = 'hidden-source-map';

const entry = {
    app: './index.js'
};

const output = {
    path: path.resolve('./dist'),
    filename: 'preducs.min.js'
};

const modules = {
    loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
            query: {
                plugins: [ 'babel-plugin-transform-object-rest-spread' ],
                presets: [ 'env' ]
            }
        }
    ]
};

module.exports = {
    devtool,
    entry,
    output,
    module: modules
};