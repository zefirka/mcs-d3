
/* Хелперы */

function randomHue(){
    return ((Math.random() * 257) >> 0).toString(16);
}

/* Генератор рандомного цвета */
function randomColor (){
    var R = randomHue(),
        G = randomHue(),
        B = randomHue();

    return '#' + R + G + B;
}

function unique(sum, item){
  if(!~sum.indexOf(item)){
    sum.push(item);
  }
  return sum;
}

function prop(x){
  return function(d){
    return d[x];
  };
}

var getDecade = prop('decade');
var getValue = prop('value');
var getTitle = prop('title');


/* Чтобы слои накладывались друг на друга в правильном порядке */
BIG_DATA.sort(function(a, b){
    return b.value - a.value;
});


/* Настройки окружения */
var margin = {
  top: 80, 
  right: 20, 
  bottom: 30, 
  left: 60
};

var bar = {
  padding : 5,
  width: 40
};

var width = 800,
    height = 650 - margin.top - margin.bottom;

var decades = ['60', '70', '80', '90', '00', '10'];
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


var genres = BIG_DATA.reduce(function(sum, item){
    if(!~sum.indexOf(item.title)){
        sum.push(item.title);
    }
    return sum;
}, []).map(function(genre){
    return {
        genre: genre,
        color: titleCap[genre]
    };
});
var selectedGenre = null;
var hiddenGenres = {};
/* Шкалы */


// Горизонтальная шакала 
var x = d3.scale.ordinal()
  .domain(decades.map(function(decade){
    return decade + '\'s';
  }))
  .rangePoints([0, 6 * bar.width - 15]);

// Вертикальаня шкала 
var y = d3.scale.linear()
  .range([height, 0])
  .domain([0, d3.max(BIG_DATA, getValue) ]);

/* Оси */

/* Абсцисс */ 
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")

/* Ординат */
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10);


/******************/
/*  Рисование */

var chart = d3.select("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right);

var svg = chart.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    .attr("transform", "translate(" + bar.width/2 + "," + (height + 10) + ")")
    .call(xAxis)

var bars = svg.selectAll(".bar")
  .data(BIG_DATA)
      .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d, i) { 
      return (bar.width + bar.padding) * (decades.indexOf(d.decade));
  })
  .attr("width", bar.width)
  .attr('data-decade', getDecade)
  .attr('data-genre', getTitle)
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
    if(selectedGenre){
      return;
    }
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
    if(selectedGenre){
      return;
    }
    d3.select('.b-popup').remove();
    $('.bar').each(function(){
      var bar = $(this);
      if(!hiddenGenres[bar.data('genre')]){
        bar.show();
      }
    });
  })


var legend = chart.append('g')
    .attr('transform', 'translate('+ (((bar.width + bar.padding) * 6) + 90)  +', '+margin.top+')')

var legends = legend.selectAll('g')
  .data(genres)
  .enter().append("g")
  .attr('transform', function(d, i){
    return 'translate(' + 0 + ',' +  i * (30 + 15) + ')'
  })

legends.append('rect')
  .attr('class', 'legend-item')
  .attr('fill', function(d){
    return d.color;
  })
  .attr('width', 30)
  .attr('height', 30)
  .attr('x', 0)
  .attr('y', 0)
  .on('click', function(){
    if(selectedGenre){
      $('.bar').not('[data-genre="' + selectedGenre + '"]').show();
    }

    var genre = this.__data__.genre;    
    selectedGenre = genre;

    if(hiddenGenres[genre]){
      alert('Genre :' + genre + ' is hidden');
      selectedGenre = null;
      return;
    }


    if(!this.__state__){
      $('.bar').not('[data-genre="' + genre + '"]').hide();
    }else{
      $('.bar').not('[data-genre="' + genre + '"]').show();
      selectedGenre = null;
    }
    this.__state__ = !this.__state__

  });

legends
  .append('svg')
  .attr('height', 40)
  .attr('width', 140)
  .attr('x', 35)
  .attr('y', -5)
  .append('text')
  .attr('class', 'legend')
  .text(function(d){
      return d.genre
  })
  .attr('y', '50%')
  .attr('alignment-baseline', 'middle')

var remove = legends
  .append('svg')
  .attr('height', 40)
  .attr('width', 140)
  .attr('x', 35)
  .attr('y', -5)
  .append('text')
  .attr('class', 'remove')
  .text('ø')
  .attr('x', '100%')
  .attr('y', '50%')
  .attr('data-genre', function(d){
    return d.genre;
  })
  .attr('alignment-baseline', 'middle')
  .attr('text-anchor', 'end')
  .on('click', function(){
    var genre = $(this).data('genre');

    if(!this.__isShown){
      d3.select(this).text('$');
      $('.bar[data-genre="' + genre + '"]').hide();
      hiddenGenres[genre] = true;
    }else{
      d3.select(this).text('ø')
      $('.bar[data-genre="' + genre + '"]').show();
      hiddenGenres[genre] = false;
    }    

    this.__isShown = !this.__isShown;
  })

