$(function () {
  $('.b-icon_aside').click(function () {
    $(this).parent().toggleClass('active');
  });
});

function toArray(a) {
  a.length = a.length || Object.keys(a).length;
  return [].slice.call(a);
}

function isTrueObject(o) {
  return typeof o === 'object' && !Array.isArray(o);
}

function isExist(o) {
  return typeof o !== 'undefined' && o !== null;
}

function interpolate(str) {
  var data = {},
      argc = arguments.length,
      argv = toArray(arguments),
      reg = /{{\s*[\w\.\/\[\]]+\s*}}/g;

  if (argc === 2 && isTrueObject(argv[1])){
    data = argv[1];
  }else {
    argv.slice(1, argc).forEach(function (e, i) {
      data[i] = e;
    });
  }

  return str.replace(reg, function (i) {
    var res = result(data, i.slice(2, -2)),
        arg = isExist(res) ? res : '';
    if (isTrueObject(arg)){
      arg = JSON.stringify(arg);
    }
    return arg;
  });
}

function result(o, str) {
  if (!str){
    return o;
  }

  return str.split('.').reduce(function (sum, prop) {
    if (~prop.indexOf('[')){
      var nth = Number(prop.match(/\[(.+?)\]/).pop());
      var nprop = prop.match(/(.+?)\[*/).pop();
      sum = sum[nprop][nth];
    }else {
      sum = sum ? sum[prop] : sum;
    }
    return sum;
  }, o);
}
function compose(f, g) {
  return function () {
    return g(f.apply(null, arguments));
  };
}

function chain() {
  return toArray(arguments).reduce(function (composed, fn) {
    return compose(fn, composed);
  });
}

function sortBy(r) {
  return function (a, b) {
    return b[r] - a[r];
  };
}

function prop(x) {
  return function (y) {
    return result(y, x);
  };
}

function sq(x) {
  return x * x;
}

function sqrt(x) {
  return Math.sqrt(x);
}

function extend() {
  return [].slice.call(arguments).reduce(function (sum, object) {
    return Object.assign(sum, object);
  });
}

function o2k(o, keyName) {
  return Object.keys(o).map(function (key) {
    var res = {};
    res[keyName || 'key'] = key;
    res.value = o[key];
    return res;
  });
}
