let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let validate = require('webpack-validator');

const config = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: 'build',
    filename: '[name].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.s?css$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader: 'elm-webpack'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CopyWebpackPlugin([{
      from: 'src/images',
      to: 'images'
    }])
  ]
};

module.exports = validate(config);
