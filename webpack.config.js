const path = require('path');
const HtmlWebpackPlugin = reqire('html-webpack-plugin');

module.exports = {
    entry : './app/index.js',
    output : {
        filename: 'main.js',
        path: `${__dirname}/dist`
    },
    devServer : {
        static: './dist',
    },
    plugins : [new HtmlWebpackPlugin({
        template: './src/index.html'
    })]
}