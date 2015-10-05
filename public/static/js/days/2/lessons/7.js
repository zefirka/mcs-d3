var BIG_DATA = [16, 23, 42, 100, 20, 77, 22, 2];

// var x = d3.scale.linear()
//     .domain([0, d3.max(BIG_DATA)])
//     .range([0, 420]);

d3.select('.container')
  .selectAll('div')
    .data(BIG_DATA)
    .enter()
    .append('div')
    .attr('class', 'bar')
    .style('width', function(d) { 
        return d + 'px';
        //return x(d) + 'px'; 
    })
    .text(function(d) { 
        return d; 
    });

