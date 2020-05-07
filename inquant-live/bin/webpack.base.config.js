const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// const pagesPath = './src/*.js';

// var pages = [];
// glob.sync(pagesPath).forEach(function (filepath) {
//   // const dir = path.dirname(filepath);
//   const filename = filepath.substr(dir.lastIndexOf('/') + 1)
//   pages.push({
//     filename,
//     dir
//   });
// });

// const plugins = pages.map((page) => {
//   return new HtmlWebpackPlugin({
//     filename: page.filename + '.html',
//     template: page.dir + '/index.html',
//     inject: true,
//     chunks: [page.filename],
//     minify: {
//       removeComments: true,
//       collapseWhitespace: true,
//       removeAttributeQuotes: true
//     },
//     chunksSortMode: 'dependency'
//   })
// });

// const entry = {};
// pages.forEach((page) => {
//   entry[page.filename] = page.dir + '/index.js';
// });

module.exports = {
  entry: {
    index: './src/index.js',
    manage: './src/manage.js',
    teacher: './src/teacher.js',
    mobile: './src/mobile.js',
  },
  resolve: {
    alias: {
      request: path.resolve(__dirname, '../src/lib/request.js'),
      lib: path.resolve(__dirname, '../src/lib'),
      vue: 'vue/dist/vue.js',
      excel: path.resolve(__dirname, '../src/teacher/excel'), 
    },
    extensions: ['.js', '.json', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-withimg-loader', 'raw-loader'],
        exclude: /(node_modules)/
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /iview.src.*?js$/,
        use: ['babel-loader'],
      },
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize', 'postcss-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true,
      chunks: ['index', 'vendor'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
      filename: 'manage.html',
      template: 'src/manage.html',
      inject: true,
      chunks: ['manage', 'vendor'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
      filename: 'teacher.html',
      template: 'src/teacher.html',
      inject: true,
      chunks: ['teacher', 'vendor'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
      filename: 'mobile.html',
      template: 'src/mobile.html',
      inject: true,
      chunks: ['mobile', 'vendor'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    })
  ],
}

// module.exports = vuxLoader.merge(webpackConfig, {
//   plugins: ['vux-ui']
// })
