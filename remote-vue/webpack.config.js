const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devServer: {
    port: 8081,
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remote_vue',
      filename: 'remoteEntry.js',
      exposes: {
        // remote-vue が外部に提供するコンポーネントやモジュールを指定
        './VueApp': './src/App.vue',
      },
      shared: {
        // マイクロフロントエンド間で共有するライブラリ
        vue: {
          singleton: true,
          requiredVersion: '^3.0.0',
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new MiniCssExtractPlugin(),
    new VueLoaderPlugin(),
  ],
};