import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
import {merge} from "webpack-merge"

import common from "./config.common"

export default merge(common, {
  mode: "production",
  optimization: {
    minimizer: [new CssMinimizerPlugin(), "..."],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{loader: MiniCssExtractPlugin.loader}, {loader: "css-loader"}],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: false,
      templateParameters: {
        production: true,
        lastModified: Date.now(),
      },
    }),
  ],
})
