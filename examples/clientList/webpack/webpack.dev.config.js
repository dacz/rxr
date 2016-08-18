var webpack = require("webpack");
var config  = require("./webpack.base.config.js");
var extend  = require("extend");
var path    = require("path");

devConfig = {
  debug: true,

  // devtool: "inline-source-map",
  devtool: 'cheap-module-source-map',

  entry: [
    "webpack-dev-server/client?http://localhost:8080",
    // "webpack/hot/only-dev-server"
  ].concat(config.entry),

  output: extend(config.output, { publicPath: "http://localhost:8080/" }),

  resolve: config.resolve,

  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //   new webpack.NoErrorsPlugin(),
  // ].concat(config.plugins),
  plugins: config.plugins,

  // module: {
  //   loaders: config.module.loaders,
  //   // loaders: [
  //   //   {
  //   //     test: /\.js$/,
  //   //     include: [
  //   //       path.resolve(__dirname, '../', 'src'),
  //   //     ],
  //   //     exclude: [
  //   //       /node_modules/,
  //   //       path.resolve(__dirname, '..', 'tests'),
  //   //     ],
  //   //     loaders: ['react-hot', 'babel-loader'],
  //   //   },
  //   //   // {
  //   //   //   test: /\.css$/,
  //   //   //   loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&&sourceMap!postcss',
  //   //   // },
  //   //   // { test: /\.css$/, loader: "style!css?module&sourceMap!postcss" },
  //   // ].concat(config.module.loaders),
  // },
  module: {
    loaders: [
      // { test: /\.jsx?$/, include: [path.resolve(__dirname, 'src')], exclude: /node_modules/, loader: "babel" },
      { test: /\.json$/, loader: "json-loader" },
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
        test: /\.css$/,
        loader: config.configuredPlugins.ExtractTextPluginConf.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&minimize!postcss')
      },
      {
        test: /\.svg$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml"
      },
    ]
  },

  postcss: function (webpack) {
    return config.postcssPlugins.concat([
      require("postcss-browser-reporter")(),
      require("postcss-reporter")(),
    ]);
  }

};

module.exports = devConfig;
