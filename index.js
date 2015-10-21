var colors = require('colors');

var config = require('./node/config/');
var express = require('./node/app');

var App = express();

process.argv.forEach(function (arg, i) {
  if (i === 2){
    config.port = Number(arg);
  }
});

var server = App.listen(config.port, function () {
  var host = server.address().address,
      port = server.address().port;

  console.log('App listening at http://127.0.0.1:%s', port);
});
