const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = {
  mode: 'development',
  entry: './src/bootstrap.js',
  devServer: {
    port: 8080,
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env'],
        },
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // それぞれの remote のURLを指定
        remoteVue: 'remote_vue@http://localhost:8081/remoteEntry.js',
        remoteReact: 'remote_react@http://localhost:8082/remoteEntry.js',
      },
      shared: {
        // 必要であればここに共有ライブラリを指定
      },
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],
};