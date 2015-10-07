var bodyParser      = require('body-parser');
var config          = require('./config/');

module.exports = function(app){
  /* Configure middlewares */
  app.use(bodyParser.urlencoded({
    extended : true
  }));

  /* Body parser configuration */
  app.use(bodyParser.json());
  app.set('views', config.views);

  /* Proxy configuration */
  app.set('trust proxy', 'loopback, 127.0.0.1');

  return app;
};
