const path = require('path');

module.exports = {
  entry: './assets/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'assets'),
    publicPath: '/assets/',
  },
  mode: 'development',
  devServer: {
    // hot: true,
    publicPath: '/assets/',
  },
};
