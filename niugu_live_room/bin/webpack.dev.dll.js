"use strict";
var path = require('path');
var webpack = require('webpack');
var ENV = process.env.NODE_ENV = process.env.ENV = 'production';
var alias = require('../plugin_alias.js');

module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'react-router', 'dva', 'js-cookie', 'qs', 'nim']
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].dll.js',
    /**
     * output.library
     * 将会定义为window.${output.library}
     * 在这次的例子中,将会定义为'window.vendor_library',
     */
    library: '[name]_library'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.DllPlugin({
      /**
       * path
       * 定义manifest 文件生成的位置
       * [name]的部分由entry的名字替换
       */
      path: path.join(__dirname, '../dist', '[name]-manifest.json'),
      /**
       * name
       * dll bundle 输出到那个全局变量上
       * 和 output.library 一样即可
       */
      name: '[name]_library',
      context: __dirname,
    })
  ],
  resolve: {
    alias: alias,
  },
};
