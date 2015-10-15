var BIG_DATA = [16, 23, 42, 100, 20, 77, 22, 2];

/* Избавиться от магических чисел */

var chart = d3.select('.chart')
  .attr('width', 120)
  .attr('height', BIG_DATA.length * (30 + 5));

var bars = chart
  .selectAll('rect')
    .data(BIG_DATA).enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', 0)
  .attr('y', function (d, i) {
    return (30 + 5) * i;
  })
  .attr('width', function (d) {
    return d + 'px';
  })
  .attr('height', 30)
  .attr('fill', 'red');

var texts = chart
  .selectAll('text')
    .data(BIG_DATA).enter()
  .append('text')
  .attr('x', 0)
  .attr('y', function (d, i) {
    return (30 + 5) * i + 30 / 2;
  })
  .text(function (d) {
    return d;
  });
