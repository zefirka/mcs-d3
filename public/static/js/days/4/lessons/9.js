//CONSTANTS 
var margin = 
    {top: 30, 
    right: 40, 
    bottom: 30, 
    left: 50},
width = 900 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;


var data_ext;

// Get the data from file
d3.csv("/static/js/data/data.csv", function(error, data) {
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.close = +d.close;
		d.line2 = +d.line2;
		d.line3 = +d.line3;
	});
    

data_ext=data;

////////////////////////////////////////////////////////////////////////////////////////
//LINE AND AREA SETUP
////////////////////////////////////////////////////////////////////////////////////////

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var y_second = d3.scale.linear().range([height, 0]);

// Scale the range of the data
x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain([d3.min(data, function(d) { return  Math.min(d.close, d.line2);})*1.1, 
           d3.max(data, function(d) { return  Math.max(d.close, d.line2);})*1.1]);   //110% of max value
y_second.domain([d3.min(data, function(d) { return  d.line3;})*1.1, 
           d3.max(data, function(d) { return  d.line3;})*1.1]);   //110% of max value

// Define the axes
var xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(5);
	//.tickFormat(d3.time.format("%Y-%m-%d"));   //specific time format for the x axis
var yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(5);
var yAxisRight = d3.svg.axis().scale(y_second) // new declaration for 'Right', 'y\
    .orient("right").ticks(5);

//Define an area
var area = d3.svg.area()
.interpolate("step-after")
.x(function(d) { return x(d.date); })
.y0(0)
.y1(function(d) { return y(d.close); });

// Define the line
var valueline = d3.svg.line()
	//.interpolate("step-before")
	//.interpolate("linear")
	.interpolate("step-after")
	//.interpolate("basis")
	//.interpolate("basis-open")
	//.interpolate("basis")
	//.interpolate("basis-closed")	
	//.interpolate("bundle")
	//.interpolate("cardinal")
	//.interpolate("cardinal-open")
	//.interpolate("cardinal-closed")
	//.interpolate("monotone")
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.close); });


// Define the line
var valueline2 = d3.svg.line()
	//.interpolate("step-before")
	//.interpolate("linear")
	//.interpolate("step-after")
	.interpolate("basis")
	//.interpolate("basis-open")
	//.interpolate("basis")
	//.interpolate("basis-closed")	
	//.interpolate("bundle")
	//.interpolate("cardinal")
	//.interpolate("cardinal-open")
	//.interpolate("cardinal-closed")
	//.interpolate("monotone")
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.line2); });

// Define the line
var valueline3 = d3.svg.line()
	//.interpolate("step-before")
	//.interpolate("linear")
	//.interpolate("step-after")
	//.interpolate("basis")
	//.interpolate("basis-open")
	//.interpolate("basis")
	//.interpolate("basis-closed")	
	//.interpolate("bundle")
	.interpolate("cardinal")
	//.interpolate("cardinal-open")
	//.interpolate("cardinal-closed")
	//.interpolate("monotone")
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y_second(d.line3*Math.random()); });


//X and Y grid lines
function make_x_axis() {
	return d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(5)
}
function make_y_axis() {
	return d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(5)
}



////////////////////////////////////////////////////////////////////////////////////////
//DRAW 
////////////////////////////////////////////////////////////////////////////////////////


// Adds the svg canvas
var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		  "translate(" + margin.left + "," + margin.top + ")");


//add area
svg.append("path")
.datum(data)
.attr("class", "area")
.attr("d", area);


// Add the valueline paths
svg.append("path")
	.attr("class", "line")
	//.style("stroke-dasharray", ("5, 5,3,3")) // line style - dashed  : 5 on 5 off 3 on 3 off
	.style("stroke-dasharray", ("2, 1, 3, 2, 4, 3, 5, 4, 6, 5,7, 6")) // line style - dashed  with specific pattern
	.attr("d", valueline(data));

svg.append("path")
	.attr("class", "line")
	.style("stroke", "red") 
	//.style("stroke-dasharray", ("2, 1, 3, 2, 4, 3, 5, 4, 6, 5,7, 6")) // line style - dashed  with specific pattern
	.attr("d", valueline2(data));

svg.append("path")    //RIGHT AXIS line
	.attr("class", "line line_third")
	.style("stroke", "green") 
	.style("stroke-dasharray", ("6,3")) // line style - dashed  with specific pattern
	.attr("d", valueline3(data));	

/*
svg.append("path")    //RIGHT AXIS symbols
	.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
    .attr("d", d3.svg.symbol());
*/
// Add the X Axis
svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.style("stroke-dasharray", ("3, 3"))  //dashed x axis
	.call(xAxis)
	.selectAll("text");
	// .style("text-anchor", "end")   //ROTATE THE X AXIS LEGEND
	// .attr("dx", "-.8em")
	// .attr("dy", ".15em")
	// .attr("transform", "rotate(-65)");

// Add the Y Axises
svg.append("g")
	.attr("class", "y axis")
	.style("stroke-dasharray", ("3, 3")) //dashed y axis
	.call(yAxis);

svg.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + width + " ,0)")
	.style("fill", "green")
	.call(yAxisRight);


//grid lines
svg.append("g")
.attr("class", "grid")
.attr("transform", "translate(0," + height + 	")")
.call(make_x_axis()
	.tickSize(height, 0, 0)
	.tickFormat(""))
svg.append("g")
.attr("class", "grid")
.call(make_y_axis()
	.tickSize(-width, 0, 0)
	.tickFormat(""))



//text to Y axis
svg.append("text") // text label for the x axis
	.attr("x", width / 2 )
	.attr("y", height + margin.bottom)
	.style("text-anchor", "middle")
	.text("Date");

//text to X axis
svg.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0 - margin.left)
	.attr("x",0 - (height / 2))
	.attr("dy", "1em")
	.style("text-anchor", "middle")
	.text("Value");


//labelling lines
svg.append("text")
.attr("transform", "translate("+(width-150)+","+y(data[data.length-1].close)+")")
.attr("dy", ".35em")
.attr("text-anchor", "start")
.style("fill", "red")
.text("Red line with basis interpolation");

svg.append("text")
.attr("transform", "translate("+(width-250)+","+y(data[data.length-1].line2-5)+")")
.attr("dy", ".35em")
.attr("text-anchor", "start")
.style("fill", "green")
.text("Green dashed line with cardinal interpolation [RIGHT]");

svg.append("text")
.attr("transform", "translate("+(width-200)+","+y(data[data.length-1].line2-10)+")")
.attr("dy", ".35em")
.attr("text-anchor", "start")
.style("fill", "darkblue")
.text("Blue dashed line with step interpolation");

svg.append("text")
.attr("transform", "translate("+(width-110)+","+height*1/6.0+")")
.attr("dy", ".35em")
.attr("text-anchor", "start")
.style("fill", "black")
.text("Area with inverted fill");


});  //data csv load3   


function updateData() {


	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);
	var y_second = d3.scale.linear().range([height, 0]);

// Scale the range of the data
	x.domain(d3.extent(data_ext, function(d) { return d.date; }));
	y.domain([d3.min(data_ext, function(d) { return  Math.min(d.close, d.line2);})*1.1, 
           d3.max(data_ext, function(d) { return  Math.max(d.close, d.line2);})*1.1]);   //110% of max value
	y_second.domain([d3.min(data_ext, function(d) { return  d.line3;})*1.1, 
           d3.max(data_ext, function(d) { return  d.line3;})*1.1]);   //110% of max value


	// ReDefine the line
	 var valueline3 = d3.svg.line()
		.interpolate("cardinal")
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y_second(d.line3*Math.random()); });


	//debugger;	
	var svg = d3.select("body").transition();
	// Make the changes
	svg.select(".line_third") // change the line
	.duration(750)
	.style("stroke", "green") 
	.style("stroke-dasharray", ("6,3")) // line style - dashed  with specific pattern
	.attr("d", valueline3(data_ext));

	//debugger;
	// svg.select(".x.axis") // change the x axis
	// .duration(750)
	// .call(xAxis);
	//svg.select(".y.axis") // change the y axis
	//.duration(750)
	//.call(yAxis);
	
}  //func update


 

