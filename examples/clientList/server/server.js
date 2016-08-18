var express = require("express");
var path    = require("path");
var config  = require("../webpack/webpack.base.config.js");

var server = express();

server.use(express.static(config.publicBasePath));

server.get('*', function (req, res) {
  res.sendFile(path.resolve(config.publicBasePath + "/index.html"));
});

var listener = server.listen(process.env.PORT || 8080, function () {
  console.log("Express server listening on port %d", listener.address().port)
});
