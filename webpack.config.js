const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode:'development',
    entry : './app/index.js',
    output : {
        filename: 'main.js',
        path: `${__dirname}/dist`
    },
    devServer : {
        static: './dist',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
        ],
    },    
    plugins : [new HtmlWebpackPlugin({
        template: './app/index.html'
    })]
}