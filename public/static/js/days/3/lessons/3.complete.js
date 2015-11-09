var LIMIT = 20;
var PADDING = 5;
var BAR_WIDTH = 30;
var MIN_TEXT_LENGTH = 100;

/* Получаем данные */
$.ajax({
  method: 'GET',
  url: 'lovecraft.txt', // тарас бульба
  dataType: 'text',
  success: draw, // <- Вот эта функция вызывается, если все ок.
  error: alert
});

/* Генератор геттера по названию ключа */
function prop(x) {
  return function (d) {
    return d[x];
  };
}

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
