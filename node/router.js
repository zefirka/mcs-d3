var fs   = require('fs');
var join   = require('path').join,
    config = require('./config');

function interpolate(html, day, lesson){
  var css = '<link rel="stylesheet" type="text/css" href="/static/css/main.css">';
  var js = '<script type="text/javascript" src="/static/js/main.js"></script>';
  var btns = '';

  if(day){
    css += '\n<link rel="stylesheet" type="text/css" href="/static/css/days/' + day + '/style.css">';
    js += '\n<script type="text/javascript" src="/static/js/days/' + day + '/main.js"></script>';
  }

  if(lesson){
    css += '\n<link rel="stylesheet" type="text/css" href="/static/css/days/' + day + '/lessons/' + lesson +'.css">'; 
    js += '\n<script type="text/javascript" src="/static/js/days/' + day + '/lessons/' + lesson +'.js"></script>';
  }

  if(day && !lesson){
    btn = '<div class="navigator"><a href="/day/' + day +'/1/">Приступим</a></div>';
  }else{
    if(lesson > 1){
      btn = '<div class="navigator"><a href="/day/' + day +'/' + (Number(lesson) - 1) + '/">Prev</a>&nbsp;' +
            '<a href="/day/' + day +'/' + (Number(lesson) + 1) + '/">Next</a></div>'
    }else{
      btn = '<div class="navigator"><a href="/day/' + day +'/' + (Number(lesson) + 1) + '/">Next</a></div>'
    }
  }

  return html .replace('</title>', '</title>' + css)
              .replace('</body>', btn + '</body>')
              .replace('</body>', js + '</body>');
}

function isFileExist(url, yes, no){
  return fs.stat(url, function(err){
    return err ? yes() : no();
  });
}

function router(app) {
  
  app.get('/', function(req, res){
    var file = join(config.views, 'index.html');
    res.sendFile(file);
  });

  app.get('/day/:day', function(req, res, next){
    var day = req.params.day;
    var file = fs.readFileSync(join(config.views, 'days', day, 'index.html'), {
      encoding: 'utf-8'
    });
    
    file = interpolate(file, day);

    res.send(file);
    next();
  });

  app.get('/day/:day/:lesson', function(req, res, next){
    var day = req.params.day;
    var lesson = req.params.lesson;

    var file = fs.readFileSync(join(config.views, 'days', day, 'lessons', lesson + '.html'), {
      encoding: 'utf-8'
    });

    file = interpolate(file, day, lesson);

    res.send(file);
    next();
  });

  app.get('/day/:day/:lesson/*.(css|png|js|jpg|gif|webm|txt|cvs|xsl)', function(req, res, next){
    var file = req.url.split('/').pop();
    var day = req.params.day;
    var url = join(config.views, 'days', day, 'lessons', file);

    res.sendFile(url);
  })

  return app;
}

module.exports = router;
