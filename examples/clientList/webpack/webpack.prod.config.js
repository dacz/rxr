var webpack           = require("webpack");
var config            = require("./webpack.base.config.js");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var prodConfig = {
  devtool: "cheap-module-source-map",

  entry: config.entry,

  resolve: config.resolve,

  output: config.output,

  plugins: config.plugins.concat([
    // new ExtractTextPlugin("styles.css"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]),

  module: {
    loaders: config.module.loaders,
  },

  postcss: function (webpack) {
    return config.postcssPlugins;
  }

};

console.log('============');
console.log(JSON.stringify(prodConfig, null, 2));
console.log('============');

module.exports = prodConfig;
