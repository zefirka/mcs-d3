var WIDTH = 500;
var HEIGHT = 500;
var R = 200;

var langs = [];

for (var lang in BIG_DATA){
  langs.push({
    name: lang,
    value: BIG_DATA[lang]
  });
}

var color = d3.scale.ordinal()
    .range(['#12928E', '#125C92', '#702877', '#537C20', '#C37A06']);

var arc = d3.svg.arc()
    .outerRadius(R - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
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
  .attr('dy', -40)
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
