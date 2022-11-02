const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const distPath = path.resolve(__dirname, isProd ? "docs" : "dist");

  return {
    mode: "development",
    entry: {
      app: "./components/index.ts"
    },
    devServer: {
      contentBase: distPath,
      compress: isProd,
      port: 8000
    },
    devtool: argv.mode === "production" ? "none" : "inline-source-map",
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [{ from: "./public", to: distPath }]
      })
    ],
    output: {
      path: distPath,
      filename: "index.js"
    },
    watch: argv.mode !== "production",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, "src"),
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.s[a|c]ss$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            { loader: "sass-loader" }
          ]
        },
        {
          test: /\.(png|gif|jpg|cur)$/i,
          loader: "url-loader",
          options: { limit: 8192 }
        },
        {
          test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: "url-loader",
          options: { limit: 10000, mimetype: "application/font-woff2" }
        },
        {
          test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: "url-loader",
          options: { limit: 10000, mimetype: "application/font-woff" }
        },
        {
          test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: "file-loader"
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    }
  };
};
