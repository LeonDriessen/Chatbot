require("dotenv").config();
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

const config = {
  entry: ["./src/front-end/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
    port: 9000,
    proxy: {
      "/api/**": {
        target: `http://localhost:3000/${process.env.SUB_DOMAIN}`,
        secure: false,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./template.html",
      favicon: "./favicon.ico",
    }),
    new LodashModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin({
      SUB_DOMAIN: process.env.SUB_DOMAIN,
      PORT: process.env.PORT,
    }),
  ],
};

module.exports = config;
