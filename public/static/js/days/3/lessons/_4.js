var $limit = $('#limit');
var $origin  = $('#origin');

$origin.on('keyup', function () {
  draw(this.value, $limit.val());
});

$limit.on('change', function () {
  draw(null, Number(this.value));
});

function notInExceptions(word) {
  return exeptions.every(function (exeption) {
    return typeof exeption == 'string' ? word !== exeption : !exeption.test(word);
  });
}

function parse(text, limit) {
  var table = [];

  var letters = text.replace(/[\.,\?\!\;\:\-«»\"\'\\(]/g, '').split('');
  var dict = letters.map(function (letter) {
    return letter.toLowerCase();
  }).filter(function (x) {
    return x !== ' ';
  })
    .reduce(function (sum, letter) {
      if (sum[letter]){
        sum[letter] += 1;
      } else {
        sum[letter] = 1;
      }
      return sum;
    }, {});

  for (var letter in dict){
    table.push({
      letter: letter,
      count: dict[letter]
    });
  }

  table.sort(function (a, b) {
    return b.count - a.count;
  });

  return table.slice(0, limit);
}

function prop(x) {
  return function (d) {
    return d[x];
  };
}

var getCount = prop('count');
var getWord = prop('letter');

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    bar_width = 50,
    width = 1024 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5);

var chart = d3.select('svg')
    .attr('height', height + margin.top + margin.bottom);

var svg = chart
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function draw(text, limit) {
  var data = parse(text, limit);
  chart.attr('width', bar_width * data.length + margin.left + margin.right);
  svg.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x = x.rangeRoundBands([0, bar_width * data.length], 0.1);
  xAxis = xAxis.scale(x);

  svg.html('');

  x.domain(data.map(getWord));
  y.domain([0, d3.max(data, getCount)]);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(-6, 0)')
    .call(yAxis)
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .attr('font-size', '12px')
    .style('text-anchor', 'end')
    .text('Количество сочетаний');

  var bars = svg.selectAll('.bar')
    .data(data)
  .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) { return x(d.letter); })
    .attr('width', x.rangeBand())
    .attr('y', function (d) { return y(d.count); })
    .attr('height', function (d) { return height - y(d.count); });
}
