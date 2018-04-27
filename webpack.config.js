const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const frontend = {
  context: path.resolve(__dirname, 'src', 'ui'),
  entry: {
    app: ['babel-polyfill', './index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'ui'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist', 'ui'),
    compress: true,
    publicPath: '/',
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './index.html',
      title: 'Tutor Assist'
    })
  ]
}

module.exports = frontend
