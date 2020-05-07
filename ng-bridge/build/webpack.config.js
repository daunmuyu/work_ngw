const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, '../src'),
    filename: "[name].js"
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.html$/,
      use: ['raw-loader'],
      exclude: /(node_modules)/
    }, {
      test: /(\.jsx|\.js)$/,
      use: {
        loader: "babel-loader"
      },
      exclude: /node_modules/
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: "./index.html",
      inject: true,
      chunks: ['main'],
    }),
  ],
};