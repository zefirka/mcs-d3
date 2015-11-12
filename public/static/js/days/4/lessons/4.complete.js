/********************************************************/
/* Константы и настройки */

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
  MAX: 100,
  RADIUS_RANGE: [10, 60]
};

var SCALES = {
  color: 'Addiction level',
  horizontal: 'Physical disorders',
  vertical: 'Mental disorders',
  radius: 'Availibility level'
};

d3.json('/static/js/data/data.4.3.json', function (error, json) {

  json = Object.keys(json).map(function (key) {
    return $.extend({
      name: key
    }, json[key]);
  });

  draw(json, $.extend(CONSTANTS, SCALES));
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

  /* Шкала радиуса */
  var radiusScale = d3.scale.linear()
    .range(opts.RADIUS_RANGE)
    .domain([d3.min(data, prop(opts.radius)), d3.max(data, prop(opts.radius))]);

  var maxColor = d3.max(data, prop(opts.color));
  var minColor = d3.min(data, prop(opts.color));
  var pivot = (maxColor + minColor / 2);

  var colorScale = d3.scale.linear()
    .range(['#00FF00', '#FF0000'])
    .domain([minColor, maxColor]);

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
  bubble
    .on('mouseover', onMouseOver)
    .on('mouseout', onMouseOut)
    .on('click', function (d) {
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

        drawPopup(d3.select(this), d);

        this._opened = 'yes';
        return;
      }

      if (opened){

        d3.selectAll('.bubble').style('display', 'inherit');
        $('.popup').fadeOut(300, function () {
        $(this).remove();
      });

        d3.select(this).attr('class', 'bubble')
          .transition()
          .duration(350)
          .attr('transform',
            'translate(' + compose(prop(opts.horizontal), x)(d) + ',' + compose(prop(opts.vertical), y)(d) + ')')
          .select('.item')
          .attr('r', compose(prop(opts.radius), radiusScale)(d));

        d3.select(this).select('.about').remove();

        hidePopup(d3.select(this));

        this._opened = 'no';
      }
    });

}

function onMouseOver() {
  d3.select(this)
    .attr('class', 'bubble mouseover')
    .style('opacity', '1');

  d3.selectAll('.bubble:not(.mouseover)')
    .transition()
    .duration(150)
    .style('opacity', '0.3');
}

function onMouseOut() {
  d3.select(this)
    .attr('class', 'bubble');

  d3.selectAll('.bubble')
    .transition()
    .duration(150)
    .style('opacity', '1');
}

function drawPopup(bubble, data) {

  var g = bubble
    .append('g')
    .style('opacity', 0)
    .attr('transform', 'translate(0, 10)');

  Object.keys(data).forEach(function (key, i) {
    var value = data[key];
    if (key == 'name'){
      return;
    }

    g
    .append('text')
    .attr('class', 'about')
    .style('text-anchor', 'middle')
    .attr('dy', 20 * i)
    .text(key + ': ' + value);
  });

  g.transition().duration(400).style('opacity', 1);
}

function hidePopup(bubble) {
  bubble.select('g').transition().duration(200).style('opacity', 0).remove();
}
