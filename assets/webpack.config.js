const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const supportedBrowsers = require("./browsers");

const paths = {
  static: path.join(__dirname, "../priv/static"),
  build: path.join(__dirname, "../priv/static/dist"),
  node_modules: path.join(__dirname, "./node_modules"),
  src: path.join(__dirname, "./"),
}
const webpackConfig = {
  context: process.cwd(),
  entry: {
    'app': ["babel-polyfill", path.join(paths.src, "js/app.js")],
    'collection': [path.join(paths.src, "js/pages/collection.js")],
    'css': path.join(paths.src, "css/app.scss"),
  },
  output: {
    path: paths.build,
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new ExtractTextPlugin("app.css"),
    new CopyWebpackPlugin([
      {from: path.join(paths.src, 'static'), to: paths.static}
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: [
              ["env", {
                targets: {
                  browsers: supportedBrowsers,
                },
              }],
            ],
            plugins: [
              ["transform-object-rest-spread", { useBuiltIns: true }],
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader?importLoaders=1&minimize&sourceMap&-autoprefixer",
            "postcss-loader",
            "sass-loader",
          ],
        }),
      },

    ],
  },
  devServer: {
    publicPath: "/",
  },
};

module.exports = webpackConfig;
