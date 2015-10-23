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

d3.json('/static/js/data/data.4.3.json', function (error, json) {
  if (error){
    throw error;
  }

  json = Object.keys(json).map(function (key) {
    var val = json[key];
    return {
      name: key,
      phisical: val.PH,
      mental: val.PS,
      prevalence: val.RR,
      addiction: val.ST
    };
  });

  draw(json, CONSTANTS);
});

function draw(data, opts) {
  // Очищаем поле
  d3.select('.chart').html('');

  // выбираем карту
  var svg = d3.select('.chart')
    .attr('width', opts.WIDTH + opts.MARGIN.LEFT + opts.MARGIN.RIGHT)
    .attr('height', opts.HEIGHT + opts.MARGIN.TOP + opts.MARGIN.BOTTOM)
      .append('g')
    .attr('transform', 'translate(' + opts.MARGIN.LEFT + ',' + opts.MARGIN.TOP + ')');

  var xScale = d3.scale.linear()
    .range([0, opts.WIDTH])
    .domain([0, 100]);

  var yScale = d3.scale.linear()
    .range([opts.HEIGHT, 0])
    .domain([0, 100]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(opts.TICKS)
    .innerTickSize(-opts.HEIGHT)
    .outerTickSize(0)
    .tickPadding(10);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .innerTickSize(-opts.WIDTH)
    .outerTickSize(0)
    .tickPadding(10);

  var line = d3.svg.line()
    .x(function (d) {
      return xScale(d.x);
    })
    .y(function (d) {
      return yScale(d.y);
    });

  var xAxisElem = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + opts.HEIGHT + ')')
    .call(xAxis);

  var yAxisElem = svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  data.forEach(function (item) {
    svg.append('path')
      .data([item])
      .attr('class', 'line')
      .attr('d', line);
  });

}
