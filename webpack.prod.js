const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCase',
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  output: {
    publicPath: './',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './template.prod.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main-bundle-[hash].css',
    }),
  ],
});
