var WIDTH = 500;
var HEIGHT = 500;
var R = 200;
var COLORS = ['#12928E', '#125C92', '#702877', '#537C20', '#C37A06'];

var langs = [];

for (var lang in BIG_DATA){
  langs.push({
    name: lang,
    value: BIG_DATA[lang]
  });
}

/* Цвета - в данном случае - это порядковая шкала измерений */
var color = d3.scale.ordinal()
  .range(COLORS);

var arc = d3.svg.arc()
  .outerRadius(R - 10)
  .innerRadius(0);

var pie = d3.layout.pie()
  .value(prop('value'));

var chart = d3.select('.chart')
  .attr('width', WIDTH)
  .attr('height', WIDTH)
    .append('g')
  .attr('transform', 'translate(' + WIDTH / 2 + ',' + HEIGHT / 2 + ')');

var g = chart.selectAll('.arc')
    .data(pie(langs))
  .enter().append('g')
    .attr('class', 'arc');

g.append('path')
    .attr('d', arc)
    .style('fill', function (d) {
      return color(d.value);
    });

g.append('text')
  .attr('transform', function (d, i) {
    return 'translate(' + arc.centroid(d, i) + ')';
  })
  .attr('dy', -50)
  .attr('dx', function (d) {
    return d.value < 10 ? 0 : (d.value > 15 ? 0 : d.value);
  })
  .style('text-anchor', 'middle')
  .text(function (d) {
    return d.data.name;
  });

function prop(name) {
  return function (data) {
    return data[name];
  };
}
