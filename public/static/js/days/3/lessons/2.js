var BIG_DATA = [16, 23, 42, 100, 20, 77, 22, 2];
var WIDTH = $(window).width();
var BAR = {
  width: 30,
  padding: 5
};

/*
 * Цель урока - перевести визуализацию из занятия 2/7 с HTML в SVG
 * Ниже представлен код визуализации из предыдущего урока:
 *
 * var x = d3.scale.linear()
 *      .domain([0, d3.max(BIG_DATA)])
 *      .range([0, 420]);
 *
 * d3.select('.chart')
 *    .selectAll('div')
 *      .data(BIG_DATA).enter()
 *    .append('div')
 *    .attr('class', 'bar')
 *    .style('width', function (d) {
 *      return x(d) + 'px';
 *    })
 *    .text(function (d) {
 *      return d;
 *    });
 *
 */
