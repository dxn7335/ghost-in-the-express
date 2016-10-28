var path = require('path');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var ExtractText = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index',
  },

  output: {
    path: path.resolve('public'),
    filename: '[name].js',
  },

  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|public)/,
        loader: 'babel-loader',
      },
      { 
        test: /\.json$/, 
        loader: 'json-loader' 
      },
      {
        test: /\.scss$/,
        loader: ExtractText.extract('style-loader', 'css-loader!sass-loader')
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2($|\?))$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
      },
      {
        test: /\.(otf|ttf|eot?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
    ],
  },

  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },

  plugins: [
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: './src/index.html'
    }),
    new ExtractText('[name].css')
  ],

  devServer: {
    inline: true,
    port: 3000,
    host: 'localhost',
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
};