var LIMIT = 20;
var PADDING = 5;
var BAR_WIDTH = 30;
var MIN_TEXT_LENGTH = 100;

/* Получаем данные */
$.ajax({
  method: 'GET',
  url: 'story.txt',
  dataType: 'text',
  success: draw, // <- Вот эта функция вызывается, если все ок.
  error: alert
});

/*
 * Функция, которая отрисовывает гистограмму
 * Принимает на вход текст - длинную строку :)
 */
function draw(text) {
  var words = parse(text);

  var maxWidth = d3.max(words, prop('count'));

  var chart = d3
    .select('.chart')
    .attr('height', words.length * (BAR_WIDTH + PADDING))
    .attr('width', maxWidth + MIN_TEXT_LENGTH);

  var groups = chart
    .selectAll('g')
      .data(words).enter()
    .append('g')
    .attr('transform', function (d, i) {
      return 'translate(0,' + i * (BAR_WIDTH + PADDING) + ')';
    });

  var bars = groups.append('rect')
    .attr('width', prop('count'))
    .attr('height', BAR_WIDTH);

  var legends = groups.append('text')
    .attr('x', function (d) {
      return (d.count + 10) + 'px';
    })
    .attr('y', BAR_WIDTH / 2)
    .attr('dy', '.35em')
    .text(function (d) {
      return d.word + ' (' + d.count + ')';
    });
}

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
