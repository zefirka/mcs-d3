/* Вертикальаня шкала */
var y = d3.scale.linear()
  .range([0, 400])
  .domain([1, 5]);

/* Ось */
var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')
  .ticks(10, 0.01);

/******************/
/*  Рисование оси */
var axisElement = d3.select('svg')
    .attr('height', 500)
    .attr('width', 50)
  .append('g')
    .attr('transform', 'translate(30, 50)')
    .attr('class', 'yAxis')
    .call(yAxis)
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', 10)
    .style('text-anchor', 'end')
    .text('Legend');
