const path = require("path")
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    content_script: path.join(__dirname, "src/content_script.tsx"),
    main: path.join(__dirname, "src/main.tsx"),
  },
  devtool: false,
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./public", to: "../" }
      ]})
  ],
};
