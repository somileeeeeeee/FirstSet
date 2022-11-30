const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './app/index.ts',
    output: {
        filename: 'main.js',
        path: `${__dirname}/dist`
    },
    devServer: {
        static: './dist'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
            inject: 'body'
        })
    ]
};
