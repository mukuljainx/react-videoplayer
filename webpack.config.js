'use strict'

var path = require('path')
var ExtractPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'src', 'index'),

  output: {
    library: 'ReactVideoPlayer',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: ExtractPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      // {
      //   test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      //   loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      // }
      {loader: 'file-loader', test: /\.svg(\?v=\d+\.\d+\.\d+)?$/}
    ]
  },

  plugins: [new ExtractPlugin('VideoPlayer.css')],

  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ]
}
