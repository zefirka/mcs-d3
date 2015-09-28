var BIG_DATA = [16, 23, 42, 100, 20, 77, 22, 2];

var x = d3.scale.linear()
    .domain([0, d3.max(BIG_DATA)])
    .range([0, 420]);

d3.select(".chart")
  .selectAll("div")
    .data(BIG_DATA)
    .enter()
    .append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .style('background-color', 'red')
    .style('margin-bottom', '2px')
    .text(function(d) { return d; });

