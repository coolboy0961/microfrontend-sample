const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  devServer: {
    port: 8082,
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remote_react',
      filename: 'remoteEntry.js',
      exposes: {
        // remote-react が外部に提供するコンポーネントやモジュールを指定
        './ReactApp': './src/App.jsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.0.0', // バージョンは適宜調整
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0',
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],
};