require('dotenv').config();
const path = require('path');

const { NODE_ENV } = process.env;

if (NODE_ENV !== 'production') {
  throw new Error(`
  NODE_ENV is not in production!

  NODE_ENV === ${NODE_ENV}
  `);
}

const outputPath = path.resolve(__dirname, 'build');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: outputPath
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    ]
  }
};
