var request = require('request');
var querystring = require('querystring');

var querystring = {
  stringify: function (b) {
    var res = '';
    for (var a in b){
      res += (a + '=' + b[a] + '&');
    }
    if (res.length){
      res = res.slice(0, -1);
    }
    return res;
  }
};

var request = {
  get: function (url) {
    var prom = $.get(url);

    return {
      on: function (type, fn) {
        type == 'response' && prom.success(fn);
        type == 'error' && prom.error(fn) ;
      }
    };
  }
};

function compose(a, b, ctxA, ctxB) {
  return function () {
    ctxA = ctxA || null;
    ctxB = ctxB || ctxA;
    return a.call(ctxA, b.apply(ctxB, arguments));
  };
}

function lastfm(key) {
  return function (method, options) {
    var url = 'http://ws.audioscrobbler.com/2.0/?api_key=' + key;
    url += '&method=' + method + '&';
    url += options ? querystring.stringify(options) : '';
    return request.get(url);
  };
}

function createDomain(func, domain) {
  return function (method, options) {
    return func(domain + '.' + method, options);
  };
}

var api = (function (getter) {
  var data = [
  'user',
  'artist',
  'album',
  'event',
  'library',
  'tag',
  'track',
  ];
  return data.reduce(function (sum, domain) {
    sum[domain] = createDomain(getter, domain);
    return sum;
  }, {});
})(lastfm('57ee3318536b23ee81d6b27e36997cde'));

api.user('getTopArtist', {
  period: '6month',
  user: 'Zloba'
}).on('response', function (data, s) {
  console.log(data, s);
});
