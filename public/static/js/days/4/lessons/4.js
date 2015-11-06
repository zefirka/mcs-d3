var svg = d3.select('svg');

svg
  .attr('width', 500)
  .attr('height', 500);

/* Width transition */
svg
  .append('rect')
  .attr('x', 5)
  .attr('y', 5)
  .attr('width', 0)
  .attr('height', 40)
  .attr('fill', 'red')
  .transition()
  .duration(1000)
  .attr('width', 300);

/* Fill transition */
svg
  .append('rect')
  .attr('x', 5)
  .attr('y', 50)
  .attr('width', 300)
  .attr('height', 40)
  .attr('fill', 'white')
  .transition()
  .duration(800)
  .attr('fill', 'red');
