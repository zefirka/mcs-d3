var CONSTANTS = {
  WIDTH: 860,
  HEIGHT: 640,
  MARGIN: {
    TOP: 20,
    LEFT: 50,
    BOTTOM: 120,
    RIGHT: 20
  },
  TICKS: 10,
  MIN: 0,
  MAX: 100
};

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
    .range([15, 100])
    .domain([d3.min(data, prop(opts.radius)), d3.max(data, prop(opts.radius))]);

  var maxColor = d3.max(data, prop(opts.color));
  var minColor = d3.min(data, prop(opts.color));
  var pivot = (maxColor + minColor / 2);

  var colorScale = d3.scale.linear()
    .range(['lightgreen', 'red'])
    .domain([minColor,   maxColor]);

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
    .attr('dy', -45)
    .style('text-anchor', 'end')
    .text(opts.vertical);

  xAxisElem.append('text')
    .attr('x', 10)
    .attr('dx', opts.WIDTH - 120)
    .attr('dy', 35)
    .attr('text-anchor', 'start')
    .text(opts.horizontal);

  var bubble = svg
    .selectAll('.bubble')
      .data(data).enter()
    .append('g')
    .attr('class', 'bubble')
    .attr('transform', function (d) {
      return 'translate(' + compose(prop(opts.horizontal), x)(d) + ',' + compose(prop(opts.vertical), y)(d) + ')';
    });

  var circle = bubble.append('circle')
    .attr('class', 'item');

  circle
    .attr('r', 2)
    .transition()
    .duration(300)
    .attr('r', compose(prop(opts.radius), radiusScale))
    .attr('fill', 'green')
    .transition()
    .duration(350)
    .attr('fill', compose(prop(opts.color), colorScale));

  bubble.append('text')
    .style('text-anchor', 'middle')
    .text(prop('name'));

  bubble.on('mouseenter', function (d, e) {
    d3.selectAll('.bubble').style('opacity', '0.3');
    d3.select(this).style('opacity', '1');
  }).on('mouseleave', function (d, e) {
    d3.selectAll('.bubble').style('opacity', '1');
  }).on('click', function (d, e) {

    if (!this._opened){
      this._opened = 'no';
    }

    var opened = this._opened == 'yes';

    if (!opened){
      d3.selectAll('.bubble')
        .style('display', 'none');

      d3.select(this)
        .style('display', 'inherit')
        .attr('class', 'bubble fixed')
        .transition()
        .duration(500)
        .attr('transform', 'translate(' + opts.WIDTH / 2 + ', ' + opts.HEIGHT / 2 + ')')
        .select('.item')
        .attr('r', 310);

      this._opened = 'yes';
      return;
    }

    if (opened){

      d3.selectAll('.bubble').style('display', 'inherit');

      d3.select(this).attr('class', 'bubble')
        .transition()
        .duration(350)
        .attr('transform',
          'translate(' + compose(prop(opts.horizontal), x)(d) + ',' + compose(prop(opts.vertical), y)(d) + ')')
        .select('.item')
        .attr('r', compose(prop(opts.radius), radiusScale)(d));

      d3.select(this).select('.about').remove();

    }
  });

}
