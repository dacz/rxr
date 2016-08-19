var webpack           = require("webpack");
var path              = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require("html-webpack-plugin");

var CopyWebpackPluginConf = new CopyWebpackPlugin([{ from: 'assets' }]);
var ExtractTextPluginConf = new ExtractTextPlugin('index.css', { allChunks: true });
var HTMLWebpackPluginConf = new HTMLWebpackPlugin({
  template: path.resolve("src/index.html"),
  filename: 'index.html', // wasnt in MZ
  inject: 'body', // wasnt in MZ
  minify: { collapseWhitespace: true }
});


var publicBasePath = 'public';

var config = {
  publicBasePath: publicBasePath,

  configuredPlugins: {
    CopyWebpackPluginConf,
    ExtractTextPluginConf,
    HTMLWebpackPluginConf
  },

  entry: [
    path.resolve("src/index.js"),
  ],

  output: {
    path: path.resolve(publicBasePath),
    publicPath: "/",
    filename: "bundle.js",
  },

  resolve: {
    extensions: ["", ".js"],
    alias: {
      "app": path.resolve(__dirname, '../src'),
    }
  },

  plugins: [
    HTMLWebpackPluginConf,
    ExtractTextPluginConf,
    CopyWebpackPluginConf,
  ],

  module: {
    loaders: [
      // { test: /\.jsx?$/, include: [path.resolve(__dirname, 'src')], exclude: /node_modules/, loader: "babel" },
      { test: /\.jsonS/, loader: "json-loader" },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../src'),
        ],
        exclude: [
          path.resolve(__dirname, '../node_modules/'),
          path.resolve(__dirname, '../tests'),
        ],
        loader: "babel-loader",
      },
      {
        test: /\.cssS/,
        loader: ExtractTextPluginConf.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&minimize!postcss')
      },
      {
        test: /\.svgS/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml"
      },
    ]
  },

  postcssPlugins: [
    require('postcss-import')({ addDependencyTo: webpack }),
    require("postcss-url")(),
    require("postcss-cssnext")(),
    require("postcss-nested")(),
    require('precss'),
  ],
};

module.exports = config;
