var width = 960,
  height = 500;

// Setting color domains(intervals of values) for our map

var color_domain = [50, 150, 350, 750, 1500];
var ext_color_domain = [0, 50, 150, 350, 750, 1500];
var legend_labels = ['< 50', '50+', '150+', '350+', '750+', '> 1500'];
var color = d3.scale.threshold()
.domain(color_domain)
.range(['#adfcad', '#ffcb40', '#ffba00', '#ff7d73', '#ff4e40', '#ff1300']);

var div = d3.select('body').append('div')
.attr('class', 'tooltip')
.style('opacity', 0);

var svg = d3.select('body').append('svg')
.attr('width', width)
.attr('height', height)
.style('margin', '10px auto');

var projection = d3.geo.albers()
.rotate([-105, 0])
.center([-10, 65])
.parallels([52, 64])
.scale(700)
.translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);

//Reading map file and data

queue()
.defer(d3.json, '/static/js/data/geo-russia.json')
.defer(d3.csv, '/static/js/days/4/lessons/acs.csv')
.await(ready);

//Start of Choropleth drawing

function ready(error, map, data) {
  var rateById = {};
  var nameById = {};

  data.forEach(function (d) {
    rateById[d.RegionCode] = +d.Deaths;
    nameById[d.RegionCode] = d.RegionName;
  });

  //Drawing Choropleth
  svg.append('g')
  .attr('class', 'region')
  .selectAll('path')
  .data(topojson.object(map, map.objects.russia).geometries)
  //.data(topojson.feature(map, map.objects.russia).features) <-- in case topojson.v1.js
  .enter().append('path')
  .attr('d', path)
  .style('fill', function (d) {
    return color(rateById[d.properties.region]);
  })
  .style('opacity', 0.8)

  //Adding mouseevents
  .on('mouseover', function (d) {
    d3.select(this).transition().duration(300).style('opacity', 1);
    div.transition().duration(300)
    .style('opacity', 1);
    div.text(nameById[d.properties.region] + ' : ' + rateById[d.properties.region])
    .style('left', (d3.event.pageX) + 'px')
    .style('top', (d3.event.pageY - 30) + 'px');
  })
  .on('mouseout', function () {
    d3.select(this)
    .transition().duration(300)
    .style('opacity', 0.8);
    div.transition().duration(300)
    .style('opacity', 0);
  });

  // Adding cities on the map

  d3.tsv('/static/js/days/4/lessons/cities.tsv', function (error, data) {
    var city = svg.selectAll('g.city')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'city')
    .attr('transform', function (d) { return 'translate(' + projection([d.lon, d.lat]) + ')'; });

    city.append('circle')
    .attr('r', 3)
    .style('fill', 'lime')
    .style('opacity', 0.75);

    city.append('text')
    .attr('x', 5)
    .text(function (d) { return d.City; });
  });

}

//Adding legend for our Choropleth

var legend = svg.selectAll('g.legend')
.data(ext_color_domain)
.enter().append('g')
.attr('class', 'legend');

var ls_w = 20, ls_h = 20;

legend.append('rect')
.attr('x', 20)
.attr('y', function (d, i) { return height - (i * ls_h) - 2 * ls_h;})
.attr('width', ls_w)
.attr('height', ls_h)
.style('fill', function (d, i) { return color(d); })
.style('opacity', 0.8);

legend.append('text')
.attr('x', 50)
.attr('y', function (d, i) { return height - (i * ls_h) - ls_h - 4;})
.text(function (d, i) { return legend_labels[i]; });
