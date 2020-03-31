const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

const config = {
    mode: 'development',
    devtool: 'source-map',
    entry: './app/src/index.js',
    resolve: {
        extensions: ['.js']
    },
    output: {
        path: path.join(__dirname, 'app'),
        filename: 'bundle.js'
    },

    performance: { hints: false },
    module: {
        rules: [{
            test: /.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    plugins: [
        new NodemonPlugin({
            watch: path.resolve('./app/src/'),
            script: './server/index.js'
        })
    ]
};

module.exports = config;