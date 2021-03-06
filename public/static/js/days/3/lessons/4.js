var WIDTH = 200;
var HEIGHT = 350;

/* Линейная шкала */
var y = d3.scale.linear()
  .range([0, HEIGHT])
  .domain([1, 5]);

/* Вертикальная ось */
var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')
  .ticks(10, 0.01);

/***************************************/
/*  Рисование оси вдоль линейной шкалы */
var linearAxisElement = d3.select('.chart-linear')
    .attr('height', HEIGHT)
    .attr('width', WIDTH)
  .append('g')
    .attr('transform', 'translate(20, 5)')
    .call(yAxis);

var axisElement = d3.select('.chart-linear-customized')
    .attr('height', HEIGHT)
    .attr('width', WIDTH)
  .append('g')
    .attr('transform', 'translate(20, 5)')
    .attr('class', 'yAxis')
    .call(yAxis)
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', 10)
    .style('text-anchor', 'end')
    .text('Legend');

WIDTH = 400;
HEIGHT = 100;

/* Порядковая шкала */
var x = d3.scale.ordinal()
  .domain(['Sovse maly', 'Maly', 'Norm', 'Bolsho', 'Oche bolsho'])
  .rangePoints([0, WIDTH]);

/* Горизонтальная ось */
var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

var axisElement = d3.select('.chart-ordinal')
    .attr('height', HEIGHT)
    .attr('width', WIDTH + 80)
  .append('g')
    .attr('transform', 'translate(40, 40)')
    .call(xAxis);

var axisElement = d3.select('.chart-ordinal-customized')
    .attr('height', HEIGHT)
    .attr('width', WIDTH + 80)
  .append('g')
    .attr('transform', 'translate(40, 5)')
    .attr('class', 'xAxis')
    .call(xAxis);
