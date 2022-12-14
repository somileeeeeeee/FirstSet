// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const CopywebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './app/fullscreen.js',
    output: {
        filename: 'main.js',
        path: `${__dirname}/dist`,
        // Needed to compile multiline strings in Cesium
        sourcePrefix: '',
        clean: true,                                  // <- 기존 dist 삭제 코드
    },
    resolve: {
        fallback: { "https": false, "zlib": false, "http": false, "url": false },
        mainFiles: ['index', 'Cesium'],
        // extensions: [".tsx", ".ts", ".js", ".jsx"],
        // alias: {                                // 
        //     root: __dirname,                      // <- 요 부분이 root,  
        //     src: path.resolve(__dirname, "app"),  //  경로의 시작점을 알려주는 코드이다.
        //   },
    },
    
    devServer: {
        static: './dist',
        https: {
            key: "./example.com+5-key.pem", // https 인증서
            cert: "./example.com+5.pem"
          }
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
                use: ['style-loader', 'css-loader' 
                    //{loader: "postcss-loader"}  // postcss 적용하기
                ],
            },
            {
                test: /\.png|gif|jpg|jpeg|svg|xml|json$/,
                use: [ 'url-loader' ]
            },
            // js에 html import 시 필요
            // {
            //     test: /\.html$/,
            //     exclude: /node_modules/,
            //     use: {loader: 'html-loader'}
            // },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname,'./app/fullscreen.html')
        }),
         // Copy Cesium Assets, Widgets, and Workers to a static directory
         new CopywebpackPlugin({ 
            patterns: [
                { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
                { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
                { from: path.join('./app/assets', 'icons'), to: 'Assets/Icons' },
                { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
                { from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty' } // drone 생성
            ]
        }),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
        })
    ]
};
