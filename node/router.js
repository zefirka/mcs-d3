var fs   = require('fs');
var join   = require('path').join,
    config = require('./config');

function nextLesson() {
  return '' +
    '<link rel="stylesheet" type="text/css" href="/static/css/main.css">' +
    '<div class="b-inner">' +
      '<div>На этом все.</div>' +
      '<div><a href="#" onClick="history.back(2)">Назад</a>' +
      '<div><a href="/">В начало</a>' +
    '</div>';
}

function interpolate(html, day, lesson) {
  //jscs:disable maximumLineLength
  var css = '<link rel="stylesheet" type="text/css" href="/static/css/main.css">';
  var js = '<script type="text/javascript" src="/static/js/main.js"></script>';
  var btns = '';

  if (day){
    css += '\n<link rel="stylesheet" type="text/css" href="/static/css/days/' + day + '/style.css">';
    js += '\n<script type="text/javascript" src="/static/js/days/' + day + '/main.js"></script>';
  }

  if (lesson){
    css += '\n<link rel="stylesheet" type="text/css" href="/static/css/days/' + day + '/lessons/' + lesson + '.css">';
    js += '\n<script type="text/javascript" src="/static/js/days/' + day + '/lessons/' + lesson + '.js"></script>';
  }

  if (day && !lesson){
    btn = '' +
      '<div class="b-inner">' +
        '<h2><a href="/day/' + day + '/1/">Приступим</a></h2>' +
        '<div><a href="/">На главную</a></div>' +
      '</div>';
  }else {
    if (lesson > 1){
      btn = '' +
        '<div class="b-inner">' +
          '<div>' +
            '<a href="/day/' + day + '/' + (Number(lesson) - 1) + '/">Prev</a>&nbsp;' +
            '<a href="/day/' + day + '/' + (Number(lesson) + 1) + '/">Next</a>' +
          '</div>' +
          '<div>' +
            '<div><a href="/">На главную</a></div>' +
          '</div>';
    }else {
      btn = '' +
        '<div class="b-inner">' +
          '<div>' +
            '<a href="/day/' + day + '/' + (Number(lesson) + 1) + '/">Next</a>' +
           '</div>' +
          '<div>' +
            '<a href="/">На главную</a>' +
          '</div>' +
        '</div>';
    }
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

function router(app) {

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

  app.get('/day/:day/:lesson', function (req, res, next) {
    var day = req.params.day;
    var lesson = req.params.lesson;
    var fileAddr = join(config.views, 'days', day, 'lessons', lesson + '.html');

    if (lesson === 'links'){
      fileAddr = join(config.views, 'days', day, 'links.html');
    }

    isFileExist(fileAddr, function () {
      var file = fs.readFileSync(fileAddr, {
        encoding: 'utf-8'
      });

      file = interpolate(file, day, lesson);

      res.send(file);
      next();
    }, function () {
      res.send(nextLesson(day, lesson));
      next();
    });

  });

  app.get('/day/:day/:lesson/*.(css|png|js|jpg|gif|webm|txt|cvs|xsl)', function (req, res, next) {
    var file = req.url.split('/').pop();
    var day = req.params.day;
    var url = join(config.views, 'days', day, 'lessons', file);

    res.sendFile(url);
  });

  return app;
}

module.exports = router;
