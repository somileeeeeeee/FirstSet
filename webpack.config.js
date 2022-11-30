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
            },
            {
                test: /\.p?css$/,  //css 파일을 선택하는 정규표현식
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    //{loader: "postcss-loader"}  // postcss 적용하기
                ],
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
