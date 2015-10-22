var BIG_DATA = [16, 23, 42, 100, 20, 77, 22, 2];
var WIDTH = $(window).width();
var BAR = {
  width: 30,
  padding: 5
};

/*
 * Цель урока - перевести визуализацию из предыдущего занятия с HTML в SVG
 */

/* Создаем шкалу, чтобы не мучаться с расчетем ширины столбцов */
var x = d3.scale.linear()
    .domain([0, d3.max(BIG_DATA)])
    .range([0, WIDTH]);

var chart = d3.select('.chart')
  .attr('width', WIDTH)
  .attr('height', BIG_DATA.length * (BAR.width + BAR.padding));

var bars = chart
  .selectAll('rect')
    .data(BIG_DATA).enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', 0)
  .attr('y', function (d, i) {
    return (BAR.width + BAR.padding) * i;
  })
  .attr('width', function (d) {
    return x(d);
  })
  .attr('height', BAR.width)
  .attr('fill', 'red');

var texts = chart
  .selectAll('text')
    .data(BIG_DATA).enter()
  .append('text')
  .attr('x', 0)
  .attr('y', function (d, i) {
    return (BAR.width + BAR.padding) * i + BAR.width / 2;
  })
  .text(function (d) {
    return d;
  });

$(window).resize(function () {
  var width = $(this).width();
  x.range([0, width]);
  chart.attr('width', width);
  bars.attr('width', function (d) {
    return x(d);
  });
});
