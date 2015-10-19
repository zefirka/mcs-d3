
function makePromise(method, url) {
  return new Promise(function (resolve, reject) {
    d3[method].call(d3, url, function (error, data) {
      if (error){
        reject(error);
      }
      resolve(data);
    });
  });
}

var sources = [
  ['xml', '/static/js/data/data.4.1.xml'],
  ['tsv', '/static/js/data/data.4.1.tsv'],
  ['csv', '/static/js/data/data.4.1.csv'],
  ['html', '/'],
  ['json', '/static/js/data/data.4.1.json'],
  ['text', '/static/js/data/data.4.1.txt']
];

var promises = sources.map(function (args) {
  return makePromise.apply(null, args);
});

Promise.all(promises).then(function (props) {
  var responses = props.reduce(function (sum, data, index) {
    sum[sources[index][0]] = data;
    return sum;
  }, {});

  console.log('Все данные загрузились!', responses);
});

var withError = makePromise('json', 'this/url/doesnt/exist.json');

withError.then(function (response) {
  console.log('Все загрузилось. Хм, странно, ведь не должно было...');
}).catch(function (error) {
  console.warn('Что-то пошло не так!');
  console.error('Ошибка:', 'STATUS:', error.status, 'MESSAGE:', error.statusText);
});
