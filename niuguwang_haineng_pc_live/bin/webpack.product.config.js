var webpack = require('webpack');
var path = require('path');
var CryptoJS = require('crypto-js');
var moment = require('moment');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 版本控制
const versionHash = CryptoJS.MD5(moment().format('x')).toString().substr(0, 4) + moment().format('YYMMDDHH');
const extractSASS = new ExtractTextPlugin(`${versionHash}/css/[name].[contenthash:8].css`);
//  配置webpack
var config = {
  entry: {
    index: ['./src/index.js'],
    vendor: ['vue', 'vuex', 'qs', 'fetch-polyfill2'],
    lock: ['./src/lock.js']
  },
  output: {
    path: path.resolve(path.resolve('./'), './dist'),
    publicPath: "/hnchat/",
    filename: `${versionHash}/js/[name].[chunkhash:8].js`
  },
  devtool: false,
  module: {
    rules: [{
      test: /\.vue$/,
      use: ['vue-loader']
    }, {
      test: /\.html$/,
      use: ['html-withimg-loader', 'raw-loader'],
      exclude: /(node_modules)/
    }, {
      test: /\.js$/,
      use: ['babel-loader', 'eslint-loader'],
      exclude: /(node_modules)|(static)/
    }, {
      test: /\.css$/i,
      use: extractSASS.extract({
        use: ['css-loader', 'postcss-loader']
      })
    }, {
      test: /\.scss$/i,
      use: extractSASS.extract({
        use: ['css-loader', 'sass-loader']
      })
    }, {
      test: /.pug$/,
      use: ['pug-loader'],
      exclude: /(node_modules)/
    }, {
      test: /\.(png|jpg|gif|jpge)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `/${versionHash}/img/[name].[hash:8].[ext]`
        }
      }]
    }, {
      test: /\.(woff|woff2|svg|eot|ttf)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `/${versionHash}/fonts/[name].[hash:8].[ext]`
        }
      }]
    }, {
      test: require.resolve("jquery"),
      use: "expose-loader?$"
    }, {
      test: require.resolve("jquery"),
      use: "expose-loader?jQuery"
    }]
  },
  plugins: [
    extractSASS,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: Infinity,
      filename: `${versionHash}/js/common.[hash:8].js`
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false
      },
      chunks: ['common', 'vendor', 'index'],
      hash: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'lock.html',
      template: 'src/lock.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false
      },
      chunks: ['common', 'lock'],
      hash: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../src/static'),
      to: 'static',
    }])
  ],
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../public'),
      'views': path.resolve(__dirname, '../src/views'),
      'store': path.resolve(__dirname, '../src/store'),
      'api': path.resolve(__dirname, '../src/api'),
      'models': path.resolve(__dirname, '../src/models'),
      'components': path.resolve(__dirname, '../src/components'),
      'vue': 'vue/dist/vue.js',
    },
    extensions: ['.js', '.css', '.scss', '.pug', '.png', '.jpg', '.vue']
  },
  externals: {}
};
module.exports = config;
