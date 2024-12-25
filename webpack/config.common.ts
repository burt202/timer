// eslint-disable-next-line import/default
import CopyWebpackPlugin from "copy-webpack-plugin"
import path from "path"
import webpack from "webpack"

import packageJson from "../package.json"

const config: webpack.Configuration = {
  entry: ["./src/index.tsx"],
  output: {
    publicPath: "/",
    path: path.join(__dirname, "../build"),
    filename: "bundle.js",
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
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{from: "src/delete.svg", to: "delete.svg"}],
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(packageJson.version),
    }),
  ],
}

export default config
