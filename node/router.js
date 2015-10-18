var fs   = require('fs');
var join   = require('path').join,
    config = require('./config');

var completes = require('./lessons.json').hasCompleted;

function nextLesson(day) {
  return '' +
    '<link rel="stylesheet" type="text/css" href="/static/css/main.css">' +
    '<div class="b-inner">' +
      '<div>На этом все.</div>' +
      '<div><a href="/day/' + day + '">Назад</a>' +
      '<div><a href="/">В начало</a>' +
    '</div>';
}

function putComplete(day, lesson, complete) {
  if (~completes[day].indexOf(Number(lesson))){
    return '' +
      '<div>' +
        (!complete ?
          ('<a href="/day/' + day + '/' + lesson + '/complete">Решение</a>') :
          ('<a href="/day/' + day + '/' + lesson + '">К уроку</a>')) +
      '</div>';
  }else {
    return '';
  }
}

function interpolate(html, day, lesson, complete) {
  //jscs:disable maximumLineLength
  var css = '<link rel="stylesheet" type="text/css" href="/static/css/main.css">';
  var js = '<script type="text/javascript" src="/static/js/main.js"></script>';
  var btns = '';
  var fname = lesson;

  if (day){
    css += '\n<link rel="stylesheet" type="text/css" href="/static/css/days/' + day + '/style.css">';
    js += '\n<script type="text/javascript" src="/static/js/days/' + day + '/main.js"></script>';
  }

  if (lesson){
    css += '\n<link rel="stylesheet" type="text/css" href="/static/css/days/' + day + '/lessons/' +
      (complete ? (lesson + '.complete') : lesson) +
    '.css">';
    js += '\n<script type="text/javascript" src="/static/js/days/' + day + '/lessons/' +
      (complete ? (lesson + '.complete') : lesson) +
    '.js"></script>';
  }

  if (day && !lesson){
    btn = '' +
      '<footer>' +
        '<div class="b-inner">' +
          '<div><a href="/">На главную</a></div>' +
        '</div>' +
      '</footer>';
  }else {
    if (lesson > 1){
      btn = '' +
        '<footer>' +
          '<div class="b-inner">' +
            '<div>' +
              '<a href="/day/' + day + '/' + (Number(lesson) - 1) + '/">Prev</a>&nbsp;' +
              '<a href="/day/' + day + '/' + (Number(lesson) + 1) + '/">Next</a>' +
            '</div>' +
            putComplete(day, lesson, complete) +
            '<div>' +
              '<div><a href="/">На главную</a></div>' +
            '</div>' +
        '</footer>';
    }else {
      btn = '' +
        '<footer>' +
          '<div class="b-inner">' +
            '<div>' +
              '<a href="/day/' + day + '/' + (Number(lesson) + 1) + '/">Next</a>' +
            '</div>' +
            putComplete(day, lesson, complete) +
            '<div>' +
              '<a href="/">На главную</a>' +
            '</div>' +
          '</div>' +
        '</footer>';
    }
  }

  if (lesson === 'links'){
    btn = '';
  }
  //jscs:enable maximumLineLength
  return html .replace('</title>', '</title>' + css)
              .replace('</body>', btn + '</body>')
              .replace('</body>', js + '</body>');
}

function isFileExist(url, yes, no) {
  return fs.stat(url, function (err) {
    return err ? no() : yes();
  });
}

function onLesson(complete) {
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

function response(fileAddr, day, lesson, complete) {
  return function (req, res, next) {
    isFileExist(fileAddr, function () {
      var file = fs.readFileSync(fileAddr, {
        encoding: 'utf-8'
      });

      file = interpolate(file, day, lesson, complete);

      res.send(file);
      next();
    }, function () {
      res.send(nextLesson(day));
      next();
    });
  };
}

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

    file = interpolate(file, day);

    res.send(file);
    next();
  });

  app.get('/day/:day/:lesson/complete', onLesson(true));
  app.get('/day/:day/:lesson', onLesson(false));

  app.get('/day/:day/:lesson/*.(css|png|js|jpg|gif|webm|txt|cvs|xsl)', function (req, res, next) {
    var file = req.url.split('/').pop();
    var day = req.params.day;
    var url = join(config.views, 'days', day, 'lessons', file);

    res.sendFile(url);
  });

  return app;
};
