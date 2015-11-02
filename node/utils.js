/// {Object} -> {Array}
function toArray(a) {
  a.length = a.length || Object.keys(a).length;
  return [].slice.call(a);
}

/// {Mixed} -> {Boolean}
function isTrueObject(o) {
  return typeof o === 'object' && !Array.isArray(o);
}

/// {Mixed} -> {Boolean}
function isExist(o) {
  return typeof o !== 'undefined' && o !== null;
}

/// {String, Object} -> {String}
/// {String, {...}} -> {String}
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
        arg = isExist(res) ? res : i;
    if (isTrueObject(arg)){
      arg = JSON.stringify(arg);
    }
    return arg;
  });
}

/// {Object, String} -> {Mixed}
function result(o, str) {
  return str.split('.').reduce(function (sum, prop) {
    if (~prop.indexOf('[')){
      var nth = Number(prop.match(/\[(.+?)\]/).pop());
      var nprop = prop.match(/(.+?)\[*/).pop();
      sum = sum[nprop][nth];
    }else {
      sum = sum[prop];
    }
    return sum;
  }, o);
}

module.exports = {
  interpolate: interpolate,
  toArray: toArray,
  result: result,
  isExist: isExist,
  isTrueObject: isTrueObject
};

