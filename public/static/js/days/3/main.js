/* Функция-хелпер */
function notInExceptions(word) {
  return exeptions.every(function (exeption) {
    return typeof exeption == 'string' ? word !== exeption : !exeption.test(word);
  });
}

function prop(name) {
  return function (data) {
    return data[name];
  };
}

/* Парсер текста */
function parse(text, limit) {
  var table = [];
  var words = text.replace(/[\.,\?\!\;\:\-«»\"\'\\(]/g, ' ').split(/\s/);

  var dict = words.map(function (word) {
    return word.toLowerCase();
  }).filter(function (word) {
    return word.length > 4 && notInExceptions(word);
  }).map(function (word) {
    var match = equals.filter(function (matcher) {
      return matcher.reg.test(word);
    });

    if (match.length){
      word = match[0].to;
    }

    return word;
  })
  .reduce(function (sum, word) {
    if (sum[word]){
      sum[word] += 1;
    } else {
      sum[word] = 1;
    }
    return sum;
  }, {});

  for (var word in dict){
    table.push({
      word: word,
      count: dict[word]
    });
  }

  table.sort(function (a, b) {
    return b.count - a.count;
  });

  return table.slice(0, LIMIT);
}
