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

var MAPS = {
  phisical: 'PH',
  mental: 'PS',
  prevalence: 'RR',
  addiction: 'ST',
  availibility: 'AI'
};

var SETTING_1 = 'addiction';
var SETTING_2 = 'availibility';
var SETTING_3 = 'phisical';

d3.json('/static/js/data/data.4.3.json', function (error, json) {
  if (error){
    throw error;
  }

  /* Преобразование данных */
  json = Object.keys(json).map(function (key) {
    var val = json[key];
    var res = {
      name: key
    };
    for (var i in MAPS){
      res[i] = val[MAPS[i]];
    }
    return res;
  });

  draw(json, CONSTANTS);
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

  var x = d3.scale.linear()
    .range([0, opts.WIDTH])
    .domain([0, 100]);

  var y = d3.scale.linear()
    .range([opts.HEIGHT, 0])
    .domain([0, 100]);

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

  var line = d3.svg.line()
    .x(function (d) {
      return x(d.x);
    })
    .y(function (d) {
      return y(d.y);
    });

  var xAxisElem = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + opts.HEIGHT + ')')
    .call(xAxis);

  var yAxisElem = svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  yAxisElem
.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 10)
  .attr('dy', '.56em')
  .style('text-anchor', 'end')
  .text(SETTING_2);

  xAxisElem
.append('text')
  .attr('x', 10)
  .attr('dx', '.56em')
  .attr('text-anchor', 'end')
  .text(SETTING_1);

  var dataSet = data.map(function (item) {
    var yR = d3.scale.linear()
      .range([0, opts.HEIGHT])
      .domain([0, 100]);

    var _x = item[SETTING_1],
        _y = item[SETTING_2];

    var x1 = x(_x[0]),
        x2 = x(_x[1]);

    var y1 = yR(_y[0]),
        y2 = yR(_y[1]);

    item.cx = _x[1] - (_x[1] - _x[0]) / 2;
    item.cy = _y[1] - (_y[1] - _y[0]) / 2;

    var r = sqrt(sq(x2 - x1) + sq(y2 - y1)) / 2;

    var scale = d3.scale.linear().domain([0, 100]).range([0, 200]);

    var div = (item[SETTING_3][0] + item[SETTING_3][1]) / 2 >> 0;

    item.r = scale(div);

    return item;
  }).sort(sortBy('r'));

  svg
    .selectAll('circle')
      .data(dataSet).enter()
    .append('circle')
    .attr('r', prop('r'))
    .attr('cx', compose(prop('cx'), x))
    .attr('cy', compose(prop('cy'), y))
    .attr('class', function (item) {
      return ['item', item.name].join(' ');
    });

  dataSet.forEach(function (item) {
    var dataset = item[SETTING_1].map(function (_x, index) {
      return {
        x: _x,
        y: item[SETTING_2][index]
      };
    });

    // svg.append('path')
    //   .data([dataset])
    //   .attr('class', ['line', item.name].join(' '))
    //   .attr('d', line);

    // dataset.forEach(function (data) {
    //   svg.append('circle')
    //     .attr('cx', x(data.x))
    //     .attr('cy', y(data.y))
    //     .attr('r', 6);
    // });

  });
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
