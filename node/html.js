var interpolate = require('./utils').interpolate;
var completes = require('./lessons.json').hasCompleted;

module.exports = {
  HTML: HTML,
  nextLesson: nextLesson
};

/* Constants */
var SCRIPT  = '<script type="text/javascript" src="{{0}}"></script>';
var LINK = '<link rel="stylesheet" type="text/css" href="{{0}}">';
var DIV = '<div class="{{className}}">{{content}}</div>';
var A = '<a href="{{href}}" class="{{className}}">{{content}}</a>';
var ELEMENT = '<{{tag}} class="{{className}}">{{content}}</{{tag}}>';

function script(src) {
  return interpolate(SCRIPT, src);
}

function link(href) {
  return interpolate(LINK, href);
}

function _div(content, className) {
  return interpolate(content ? DIV : '', {
    content: content || '',
    className: className || ''
  });
}

function _a(href, content, className) {
  return interpolate(A, {
    href: href || '',
    className: className || '',
    content: content || ''
  });
}

function _el(descr) {
  if (Array.isArray(descr.content)){
    descr.content = descr.content.join('');
  }
  descr.content = descr.content || '';
  descr.className = descr.className || '';
  return interpolate(ELEMENT, descr);
}

function content(fn, arr) {
  return arr.map(function (opts) {
    if (opts === null){
      return '';
    }

    if (Array.isArray(opts)){
      return fn.apply(null, opts);
    }else {
      return fn(opts);
    }
  }).join('');
}

function putComplete(day, lesson, complete, completes) {
  var hasCompleted = ~completes[day].indexOf(Number(lesson));

  return hasCompleted ? (
    _div(!complete ?
      _a('/day/' + day + '/' + lesson + '/complete', 'Решение') :
      _a('/day/' + day + '/' + lesson, 'К уроку'))) : '';
}

function nextLesson(day) {
  return link('/static/css/main.css') +
    _div(
      content(_div, [
        'На этом все',
        _a(src, 'Назад'),
        _a('/', 'В начало')
      ]), 'b-inner');
}

function HTML(html, day, lesson, complete) {
  //jscs:disable maximumLineLength
  var css = content(link, [
    '/static/css/main.css',
      day ?
    '/static/css/days/' + day + '/style.css'
      : null,

      lesson && lesson !== 'links' ?
    '/static/css/days/' + day + '/lessons/' + (complete ? (lesson + '.complete') : lesson) + '.css'
      : null
  ]);

  var js = content(script, [
    '/static/js/d3.js',
    'https://code.jquery.com/jquery-1.11.3.js',
    '/static/js/main.js',

      day ?
    '/static/js/days/' + day + '/main.js'
      : null,

      lesson && lesson !== 'links' ?
    '/static/js/days/' + day + '/lessons/' + (complete ? (lesson + '.complete') : lesson) + '.js'
      : null
  ]);

  var popupDescriptor = {
    tag: 'div',
    className: 'b-inner',
    content: []
  };

  popupDescriptor.content = day && !lesson ? _div(_a('/', 'На главную')) : [
    _el({
      tag: 'div',
      content: [
          lesson > 1 ?
        _a('/day/' + day + '/' + (Number(lesson) - 1) + '/', 'Prev&nbsp;&nbsp;')
          : null,
        _a('/day/' + day + '/' + (Number(lesson) + 1) + '/', 'Next')
      ]
    }),

    putComplete(day, lesson, complete, completes),

    _el({
      tag: 'div',
      content: content(_div, [
        _a('/day/' + day, 'К списку уроков'),
        _a('/', 'На главную')
      ])
    })
  ];

  var aside = lesson !== 'links' ? _el({
    tag: 'aside',
    content: [
      _el({
        tag: 'span',
        className: 'b-icon_aside'
      }),
      _el(popupDescriptor)
    ]
  }) : '';

  //jscs:enable maximumLineLength
  return html .replace('</title>', '</title>' + css)
              .replace('</body>', aside + '</body>')
              .replace('</body>', js + '</body>');
}
