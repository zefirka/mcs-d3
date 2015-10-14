function prop(x){
    return function(d){
        return d[x];
    };
}

var getDecade = prop('decade');
var getValue = prop('value');
var getTitle = prop('title');

var margin = {
    top: 80, 
    right: 20, 
    bottom: 30, 
    left: 60
};

BIG_DATA.sort(function(a, b){
    return b.value - a.value;
})

var bar_padding = 5,
    bar_width = 40,
    width = (5 * (bar_width + 20)) - margin.left - margin.right + 50,
    height = 650 - margin.top - margin.bottom;

var x = d3.scale.ordinal().domain([
    '60\'s',
    '70\'s',
    '80\'s',
    '90\'s',
    '00\'s',
    '10\'s',
    ])
    .rangePoints([0, 6 * bar_width - 15]);

var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(BIG_DATA, function(a, b){
            return a.value;
        })]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

var chart = d3.select("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right);

var svg = chart
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function randomHue(){
    return ((Math.random() * 257) >> 0).toString(16);
}

function randomColor (){
    var R = randomHue(),
        G = randomHue(),
        B = randomHue();

    return '#' + R + G + B;
}

var rangeCap = ['60', '70', '80', '90', '00', '10'];
var titleCap = {
    'Progressive' : '#22AB96',
    'Hard Rock / Heavy Metal' : '#EA7414',
    'Psychedelic' : '#98C111',
    'Gothic' : '#9940D4',
    'Industrial' : '#3C1D6F',
    'Thrash / Death / Doom' : '#9A041B',
    'Classic Rock' : '#E8CD50',
    'Post-Rock': '#541D1D'
}


svg.append("g")
  .attr("class", "y axis")
  .attr('transform', "translate(-25, 0)")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .attr('font-size', "12px")
  .style("text-anchor", "end")
  .text("Percentage");


svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + bar_width/2 + "," + (height + 10) + ")")
    .call(xAxis)
    // .append("text")
    //   .attr("y", 6)
    //   .attr("dy", ".71em")
    //   .attr('font-size', "12px")
    //   .style("text-anchor", "end")
    //   .text("Decades");

var bars = svg.selectAll(".bar")
    .data(BIG_DATA)
        .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) { 
        //return d.decade + '\'s';
        return (bar_width + bar_padding) * (rangeCap.indexOf(d.decade));
    })
    .attr("width", bar_width)
    .attr('data-decade', getDecade)
    .attr("fill", function(d){
        return titleCap[d.title];
    })
    .attr("y", function(d) { 
        return y(d.value); 
    })
    .attr("height", function(d) { 
        return height - y(d.value); 
    })

    .on('mouseenter', function(){
        var MIN_WIDTH = 80;
        var $selected = $(this);
        var decade = $selected.data('decade');
        var others = $('.bar[data-decade="' + decade + '"]');
        var selectedHeight = Number($selected.attr('height'));
        var d3Selection = d3.select(this);
        var _this = this;

        others.each(function(){
            var $bar = $(this);
            var height = Number($bar.attr('height'));
            if( height < selectedHeight){
                $bar.hide();
            }
        });
        var popup = svg.append('g')
            .attr('transform', 'translate(0,-60)')
            .attr('class', 'b-popup')
        

        var p = (function(){
            var width = MIN_WIDTH;
            var letters = _this.__data__.title.length;
            var c = letters > 15 ? (letters - 15) * 9 : 0;
            width = MIN_WIDTH + c;
            
            var maxY = y([].reduce.call(others, function(sum, elem){
                return elem.__data__.value > sum ? elem.__data__.value : sum;
            }, 0));

            var x = Number(d3Selection.attr('x')) - width/2 + c/2;

            return {
                y: maxY,
                w: width,
                x: x
            }
        })();
          

        popup.append('rect')
            .attr('class', 'popup')
            .attr('x', p.x)
            .attr('y', p.y)
            .attr('width', p.w)
            .attr('height', 30)
        
        popup.append('svg')
            .attr('width', p.w)
            .attr('height', 30)
            .attr('x', p.x)
            .attr('y', p.y)
            .append('text')
            .attr('x', '50%')
            .attr('y', '50%')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text(function(){
                var d = _this.__data__;
                return d.title + '  (' + d.value + ')';
            })

    }).on('mouseleave', function(){
        d3.select('.b-popup').remove();
        $('.bar').show();
    })
