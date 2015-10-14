
/* Хелперы */

/* Возвращает случайное число HEX-число (до 256) */
function randomHex(){
    return ((Math.random() * 257) >> 0).toString(16);
}

/* Генератор рандомного цвета */
function randomColor (){
    var R = randomHex(),
        G = randomHex(),
        B = randomHex();

    return '#' + R + G + B;
}

/* Редьюсер оставляющий в массиве только уникальные элементы */
function unique(sum, item){
  if(!~sum.indexOf(item)){
    sum.push(item);
  }
  return sum;
}

/* Генератор геттера по названию ключа */
function prop(x){
  return function(d){
    return d[x];
  };
}


/**
 * Начнем! 
 * Для начала настроим окружение, чтобы было проще работать.
 * 
 * Используем функции-хелперы, что подготовить нужные переменные и 
 * функции, которые облегчат нам жизнь и сделают количество кода меньше
 */

/* Часто используемые геттеры */
var getGenre = prop('genre');
var getDecade = prop('decade');
var getValue = prop('value');
var getTitle = prop('title');
var getColor = prop('color');


/* 
 * Чтобы слои накладывались друг на друга в правильном порядке, отсортируем данные по величине 
 */
BIG_DATA.sort(function(a, b){
    return b.value - a.value;
});

/* Визуальные константы */
// Отступы
var MARGIN = {
  top: 80, 
  right: 20, 
  bottom: 30, 
  left: 60
};

// Палки
var BAR = {
  padding : 5,
  width: 40
};

// Общая высота и ширина гистограммы
var WIDTH = 800,
    HEIGHT = 500;

/* Данные для преобразований */
var decades = ['60', '70', '80', '90', '00', '10'];
var titleColors = {
  'Progressive' : '#22AB96',
  'Hard Rock / Heavy Metal' : '#EA7414',
  'Psychedelic' : '#98C111',
  'Gothic' : '#9940D4',
  'Industrial' : '#3C1D6F',
  'Thrash / Death / Doom' : '#9A041B',
  'Classic Rock' : '#E8CD50',
  'Post-Rock': '#541D1D'
}

/* 
 * Список уникальных жанров
 */
var genres = BIG_DATA
      .map(getTitle)
      .reduce(unique, [])
      .map(function(genre){
        return {
          genre: genre,
          color: titleColors[genre]
        };
      });


/* Состояние приложения */
var selectedGenre = null; // выбранный жанр для показа
var hiddenGenres = {}; // скрытые жанры



/********************/
/* Шкалы */

// Горизонтальная шакала 
var x = d3.scale.ordinal()
  .domain(decades.map(function(decade){
    return decade + '\'s'; // преобразуем значения десятилетий в удобный для человека формат
  }))
  .rangePoints([0, 6 * BAR.width - 15]);

// Вертикальаня шкала 
var y = d3.scale.linear()
  .range([HEIGHT, 0])
  .domain([0, d3.max(BIG_DATA, getValue) ]);



/********************/
/* Оси */

/* Абсцисс */ 
var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom')

/* Ординат */
var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')
  .ticks(20);



/********************/
/*  Рисование */

var chart = d3.select('svg')
  .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
  .attr('width', WIDTH + MARGIN.left + MARGIN.right);

var workspace = chart.append('g')
  .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

var yAxisElement = workspace.append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(-25, 0)')
  .call(yAxis)

var yAxisLegend = yAxisElement.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 6)
  .attr('dy', '.71em')
  .attr('font-size', '12px')
  .style('text-anchor', 'end')
  .text('Percentage');

var xAxisElement = workspace.append("g")
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + BAR.width/2 + ',' + (HEIGHT + 10) + ')')
    .call(xAxis);

var bars = workspace.selectAll('.bar')
  .data(BIG_DATA)
    .enter().append('rect')
  .attr('class', 'bar')
  .attr('x', function(d, i) { 
      return (BAR.width + BAR.padding) * (decades.indexOf(d.decade));
  })
  .attr('width', BAR.width)
  .attr('data-decade', getDecade)
  .attr('data-genre', getTitle)
  .attr('fill', function(d){
      return titleColors[d.title];
  })
  .attr('y', function(d) { 
      return y(d.value); 
  })
  .attr('height', function(d) { 
      return HEIGHT - y(d.value); 
  })

/** События палок */
bars.on('mouseenter', function(){
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

  var popup = workspace.append('g')
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

    var x = Number(d3Selection.attr('x')) - width/2 + BAR.width/2;

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
});

/** Интерактивная легенда */

/* Параметры легенда */

var LEGEND = {
  width: (((BAR.width + BAR.padding) * 6) + 90),
  height: 30,
  marginBottom: 15
}

var legend = chart.append('g')
    .attr('transform', 'translate('+ LEGEND.width + ', ' + MARGIN.top+ ')')

var legends = legend.selectAll('g')
  .data(genres)
  .enter().append('g')
  .attr('transform', function(d, i){
    return 'translate(' + 0 + ',' +  i * (LEGEND.height + LEGEND.marginBottom) + ')'
  })

legends.append('rect')
  .attr('class', 'legend-item')
  .attr('fill', getColor)
  .attr('width', LEGEND.height)
  .attr('height', LEGEND.height)
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
  .text(getGenre)
  .attr('y', '50%')
  .attr('alignment-baseline', 'middle')

legends
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
  .attr('data-genre', getGenre)
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

