var fs          = require('fs');
var join        = require('path').join,
    config      = require('./config'),
    utils       = require('./utils'),
    htmlModule  = require('./html');

var HTML = htmlModule.HTML;
var nextLesson = htmlModule.nextLesson;

/// {String, Function, Function} -> {Void}
function isFileExist(url, yes, no) {
  return fs.stat(url, function (err) {
    return err ? no() : yes();
  });
}

/// {Boolean} -> {Function}
function onLesson(complete) {
  /// {Object, Object, Object} -> {Void}
  return function (req, res, next) {
    var day = req.params.day;
    var lesson = req.params.lesson;
    var fileAddr = join(config.views, 'days', day, 'lessons', lesson + '.html');

    if (lesson === 'links'){
      fileAddr = join(config.views, 'days', day, 'links.html');
    }

    if (complete){
      var testFile = join(config.views, 'days', day, 'lessons', lesson + '.complete.html');
      isFileExist(testFile, function () {
        response(testFile, day, lesson, complete)(req, res, next);
      }, function () {
        response(fileAddr, day, lesson, complete)(req, res, next);
      });
    }else {
      response(fileAddr, day, lesson, complete)(req, res, next);
    }
  };
}

/// {String, String|Number, String|Number, Boolean} -> {Function}
function response(fileAddr, day, lesson, complete) {
  /// {Object, Object, Object} -> {Void}
  return function (req, res, next) {
    isFileExist(fileAddr, function () {
      var file = fs.readFileSync(fileAddr, {
        encoding: 'utf-8'
      });

      file = HTML(file, day, lesson, complete);

      res.send(file);
      next();
    }, function () {
      res.send(nextLesson(day));
      next();
    });
  };
}

/* Routes */
/// {Object} -> {Void}
module.exports = function (app) {
  app.get('/', function (req, res) {
    var file = join(config.views, 'index.html');
    res.sendFile(file);
  });

  app.get('/day/:day', function (req, res, next) {
    var day = req.params.day;
    var file = fs.readFileSync(join(config.views, 'days', day, 'index.html'), {
      encoding: 'utf-8'
    });

    file = HTML(file, day);

    res.send(file);
    next();
  });

  app.get('/day/:day/:lesson/complete', onLesson(true));
  app.get('/day/:day/:lesson', onLesson(false));

  app.get('/day/:day/:lesson/*.*', function (req, res, next) {
    var file = req.url.split('/').pop();
    var day = req.params.day;
    var url = join(config.views, 'days', day, 'lessons', file);

    res.sendFile(url);
  });

  return app;
};
