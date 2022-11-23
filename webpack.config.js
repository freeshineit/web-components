const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Sass = require('sass')

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'
  const distPath = path.resolve(__dirname, isProd ? 'docs' : 'dist')

  return {
    mode: 'development',
    entry: {
      app: './src/index.ts',
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: isProd,
      port: 3000,
    },
    devtool: argv.mode === 'production' ? undefined : 'inline-source-map',
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/index.html'),
        filename: 'index.html',
      }),
    ],
    output: {
      path: distPath,
      filename: 'index.js',
      publicPath: isProd ? './' : '',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s[a|c]ss$/,
          use: [
            {
              loader: 'lit-css-loader',
              options: {
                transform: (data, { filePath }) =>
                  Sass.renderSync({ data, file: filePath }).css.toString(),
              },
            },
          ],
        },
        {
          test: /\.(png|gif|jpg|cur)$/i,
          loader: 'url-loader',
          options: { limit: 8192 },
        },
        {
          test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'application/font-woff2' },
        },
        {
          test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'application/font-woff' },
        },
        {
          test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: 'file-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  }
}
