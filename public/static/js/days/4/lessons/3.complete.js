var CONSTANTS = {
  WIDTH: 860,
  HEIGHT: 600,
  MARGIN: {
    TOP: 20,
    LEFT: 40,
    BOTTOM: 40,
    RIGHT: 20
  },
  TICKS: 10,
  MIN: 0,
  MAX: 100
};

CONSTANTS.MAX_RADIUS = (CONSTANTS.WIDTH / CONSTANTS.HEIGHT) * 100 >> 0;
CONSTANTS.MIN_RADIUS = CONSTANTS.MAX_RADIUS - 87;

var SCALES = {
  color: 'Addiction level',
  horizontal: 'Physical disorders',
  vertical: 'Mental disorders',
  radius: 'Availibility level'
};

d3.json('/static/js/data/data.4.3.json', function (error, json) {
  if (error){
    throw error;
  }

  json = Object.keys(json).map(function (key) {
    return merge({
      name: key
    }, json[key]);
  });

  draw(json, merge(CONSTANTS, SCALES));
});

/* Функция русуящая график */
function draw(data, opts) {
  // Очищаем поле
  d3.select('.chart').html('');

  // выбираем карту
  var svg = d3.select('.chart')
    .attr('width', opts.WIDTH + opts.MARGIN.LEFT + opts.MARGIN.RIGHT)
    .attr('height', opts.HEIGHT + opts.MARGIN.TOP + opts.MARGIN.BOTTOM)
      .append('g')
    .attr('transform', 'translate(' + opts.MARGIN.LEFT + ',' + opts.MARGIN.TOP + ')');

  /* Горизонтальная шкала */
  var x = d3.scale.linear()
    .range([0, opts.WIDTH])
    .domain([0, 100]);

  /* Вертикальная шкала */
  var y = d3.scale.linear()
    .range([opts.HEIGHT, 0])
    .domain([0, 100]);

  /* Вычисляется по значению поля доступность */
  var radiusScale = d3.scale.linear()
    .range([opts.MAX_RADIUS, opts.MIN_RADIUS])
    .domain([0, 100]);

  var colorScale = d3.scale.linear()
    .domain([0, 100])
    .range(['green', 'red']);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(opts.TICKS)
    .innerTickSize(-opts.HEIGHT)
    .outerTickSize(0)
    .tickPadding(10);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .innerTickSize(-opts.WIDTH)
    .outerTickSize(0)
    .tickPadding(10);

  var xAxisElem = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + opts.HEIGHT + ')')
    .call(xAxis);

  var yAxisElem = svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  yAxisElem.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 10)
    .attr('dy', '.56em')
    .style('text-anchor', 'end')
    .text(opts.mental);

  xAxisElem.append('text')
    .attr('x', 10)
    .attr('dx', '.56em')
    .attr('text-anchor', 'end')
    .text(opts.phys);

  svg
    .selectAll('circle')
      .data(data).enter()
    .append('circle')
    .attr('r', compose(prop(opts.radius), radiusScale))
    .attr('cx', compose(prop(opts.horizontal), x))
    .attr('cy', compose(prop(opts.vertical), y))
    .attr('fill', compose(prop(opts.color), colorScale))
    .attr('class', 'item');
}

function compose(f, g) {
  return function () {
    return g(f.apply(null, arguments));
  };
}

function sortBy(r) {
  return function (a, b) {
    return b[r] - a[r];
  };
}

function prop(x) {
  return function (y) {
    return y[x];
  };
}

function sq(x) {
  return x * x;
}

function sqrt(x) {
  return Math.sqrt(x);
}

function merge() {
  return [].slice.call(arguments).reduce(function (sum, object) {
    return Object.assign(sum, object);
  });
}

