var WIDTH = 960;
var HEIGHT = 700;

var MSK = {
  center: [37.616031,55.755639],
  scale: 35000
};

var url = '/static/js/data/moscow.json';

d3.json(url, function (error, msk) {
  if (error){
    throw error;
  }

  var svg = d3.select('.chart')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  var projection = d3.geo.mercator()
   .center(MSK.center)
   .scale(MSK.scale);

  var path = d3.geo.path()
      .projection(projection);

  svg.selectAll('.district')
      .data(topojson.feature(msk, msk.objects.districts).features)
      .enter()
    .append('path')
      .attr('d', path)
      .attr('stroke', 'white');
});
