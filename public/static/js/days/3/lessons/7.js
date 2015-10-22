/* Цель урока сделать конфигурируемый граффик */

/* Сначала определим функции, которые помогут нам обрабатывать данные */
function calculate(fn, from, to, ticks) {
  var i = from;
  var set = [];
  while (i <= to){
    set.push(fn(i));
    i += ticks || 1;
  }
  return set;
}

/* Это функция, которая будет определять вид графика */
function FORMULA(x) {
  return Math.sin(2 * x) * x * x ;
}

function prop(name) {
  return function (data) {
    return data[name];
  };
}

var MARGIN = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 40
};

var WIDTH = 800 - MARGIN.left - MARGIN.right;
var HEIGHT = 400   - MARGIN.top - MARGIN.bottom;
var X_FROM = 0;
var X_TO = 20;
var Y_FROM = 0;
var Y_TO = 500;
var TICKS = 0.1;

var dataset = calculate(function (x) {
  return {
    x: x,
    y: FORMULA(x)
  };
}, X_FROM, X_TO, TICKS);

draw(dataset);

function draw(dataset) {
  d3.select('.chart').html('');

  var svg = d3.select('.chart')
    .attr('width', WIDTH + MARGIN.left + MARGIN.right)
    .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
      .append('g')
    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

  var xScale = d3.scale.linear()
    .range([0, WIDTH])
    .domain([0, d3.max(dataset, prop('x'))]);

  var yScale = d3.scale.linear()
    .range([HEIGHT, 0])
    .domain([Y_FROM /* d3.min(dataset, getY) */, Y_TO /* d3.max(dataset, getY)*/]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(15)
    .innerTickSize(-HEIGHT)
    .outerTickSize(0)
    .tickPadding(10);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .innerTickSize(-WIDTH)
    .outerTickSize(0)
    .tickPadding(10);

  var line = d3.svg.line()
    .x(function (d) { return xScale(d.x); })
    .y(function (d) { return yScale(d.y); });

  var xAxisElem = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + HEIGHT + ')')
    .call(xAxis);

  var yAxisElem = svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  var path = svg.append('path')
    .data([dataset])
    .attr('class', 'line')
    .attr('d', line);
}

