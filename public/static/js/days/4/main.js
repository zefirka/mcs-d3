function compose(f, g) {
  return function () {
    return g(f.apply(null, arguments));
  };
}

function sortBy(r) {
  return function (a, b) {
    return b[r] - a[r];
  };
}

function prop(x) {
  return function (y) {
    return y[x];
  };
}

function sq(x) {
  return x * x;
}

function sqrt(x) {
  return Math.sqrt(x);
}

function merge() {
  return [].slice.call(arguments).reduce(function (sum, object) {
    return Object.assign(sum, object);
  });
}
