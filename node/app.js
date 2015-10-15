var express         = require('express'),
    fs              = require('fs'),
    morgan,         // inited only in dev mode
    color;          // inited only in dev mode

var config          = require('./config/');

var Middlewares     = require('./middlewares.js'),
    Router          = require('./router.js');

module.exports = function () {
  var app = express();
  Middlewares(app);
  Router(app);

  /* Useragent enviroment configuration */
  app.use(express.static(config.public));

  return app;
};
