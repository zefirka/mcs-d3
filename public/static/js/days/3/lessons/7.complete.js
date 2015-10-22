/* Цель урока сделать граффик */

function debounce(fn, timeout) {
  var t = null;
  return function () {
    var args = arguments;
    if (t){
      clearTimeout(t);
    }
    t = setTimeout(function () {
      fn.apply(this, args);
    }.bind(this), timeout);
  };
}

function calculate(fn, from, to, ticks) {
  var i = from;
  var set = [];
  while (i <= to){
    set.push(fn(i));
    i += ticks || 1;
  }
  return set;
}

function prop(name) {
  return function (data) {
    return data[name];
  };
}

var getX = prop('x');
var getY = prop('y');

var MARGIN = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 40
};

var WIDTH = 800 - MARGIN.left - MARGIN.right;
var HEIGHT = 400   - MARGIN.top - MARGIN.bottom;

function draw(dataset, mins, maxs) {
  var maxY = (maxs && maxs.y) || d3.max(dataset, getY);
  var minY = (mins && mins.y) || d3.min(dataset, getY);
  var maxX = (maxs && maxs.x) || d3.max(dataset, getX);
  var minX = (mins && mins.x) || d3.min(dataset, getX);

  d3.select('.chart').html('');

  var svg = d3.select('.chart')
    .attr('width', WIDTH + MARGIN.left + MARGIN.right)
    .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
      .append('g')
    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

  var xScale = d3.scale.linear()
    .range([0, WIDTH])
    .domain([minX || 0, maxX]);

  var yScale = d3.scale.linear()
    .range([HEIGHT, 0])
    .domain([minY,  maxY]);

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

draw(calculate(function (x) {
  return {
    x: x,
    y: 2 * x
  };
}, 0, 15));

/* Интерактивность */
([
  '#function',
  '#x-from',
  '#x-to',
  '#y-from',
  '#y-to'
]).forEach(function (selector) {
  d3.select(selector).on('input', debounce(function () {
    var xFrom = Number($('#x-from').val());
    var xTo = Number($('#x-to').val());
    var yFrom = Number($('#y-from').val());
    var yTo = Number($('#y-to').val());
    var val = $('#function').val();

    dataset = calculate(function (x) {
      var y;
      try{
        y = eval(val);
      }catch (error){
        console.log('Wrong syntax');
      }finally{
        return {
          x: x,
          y: y
        };
      }
    }, xFrom, xTo, 0.1);

    draw(dataset, {
      x: xFrom,
      y: yFrom}, {
      x: xTo,
      y: yTo
    });
  }, 300));
});
