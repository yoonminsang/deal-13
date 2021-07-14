import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const cleanWebpackPlugin = CleanWebpackPlugin.cleanWebpackPlugin;
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const __dirname = path.resolve();

export default () => {
  return {
    mode: 'development',
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]?[hash]',
            },
          },
        },
        {
          test: /\.(js|ts)$/,
          exclude: /(node_modules)/, // .js, .ts 확장자로 끝나는 모든 파일
          use: {
            loader: 'babel-loader', // babel-loader 적용
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
              plugins: [
                '@babel/proposal-class-properties',
                '@babel/proposal-object-rest-spread',
              ],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // fallback to style-loader in development
            process.env.NODE_ENV !== 'production'
              ? 'style-loader'
              : MiniCssExtractPlugin.loader, // style-loader : 자바스크립트로 변경된 스타일을 동적으로 돔에 추가하는 로더, min~~로더 : 파일 쪼개기
            'css-loader', // CSS 파일을 모듈처럼 불러와 사용할 수 있게 도와줌
            'sass-loader', // sass 사용
          ],
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }), // HTML 파일을 후처리하는데 사용, 빌드 타임의 값을 넣거나 코드를 압축
      new CleanWebpackPlugin(), // 빌드 이전 결과물을 제거하는 플러그인
      new MiniCssExtractPlugin({
        // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
    devServer: {
      contentBase: path.resolve(__dirname + '/dist'),
      index: 'index.html',
      port: 9000,
      writeToDisk: true,
      hot: true,
    },
  };
};

//   ----- node-sass 이거는 필요한지 모르겠음  webpack-combine-loaders
