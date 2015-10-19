/****************************************/
/* Хелперы */

/* Возвращает случайное число HEX-число (до 256) */
// function randomHex() {
//   return ((Math.random() * 257) >> 0).toString(16);
// }

/* Генератор рандомного цвета */
// function randomColor() {
//   var R = randomHex(),
//       G = randomHex(),
//       B = randomHex();

//   return '#' + R + G + B;
// }

// /* Редьюсер оставляющий в массиве только уникальные элементы */
// function unique(sum, item) {
//   if (!~sum.indexOf(item)){
//     sum.push(item);
//   }
//   return sum;
// }

//  Генератор геттера по названию ключа
// function prop(x) {
//   return function (d) {
//     return d[x];
//   };
// }

// function rotate(deg) {
//   return function () {
//     var x = Number(d3.select(this).attr('x'));// + 4.1;
//     var y = Number(d3.select(this).attr('y'));// + 8;
//     return 'rotate(' + deg + ', ' + x + ',' + y + ')';
//   };
// }

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
BIG_DATA.sort(function (a, b) {
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

// Свойства столбцов
var BAR = {
  padding: 5,
  width: 40
};

// Общая высота и ширина гистограммы
var WIDTH = 800,
    HEIGHT = 500,
    POPUP_MIN_WIDTH = 80;

/* Данные для преобразований */
var decades = ['60', '70', '80', '90', '00', '10'];
var titleColors = {
  Progressive: '#22AB96',
  'Hard Rock / Heavy Metal': '#EA7414',
  Psychedelic: '#98C111',
  Gothic: '#9940D4',
  Industrial: '#3C1D6F',
  'Thrash / Death / Doom': '#9A041B',
  'Classic Rock': '#E8CD50',
  'Post-Rock': '#541D1D'
};

/*
 * Список уникальных жанров
 */
var genres = BIG_DATA
      .map(getTitle)
      .reduce(unique, [])
      .map(function (genre) {
        return {
          genre: genre,
          color: titleColors[genre]
        };
      });

/* Состояние приложения */
var selectedGenre = null; // выбранный жанр для показа
var hiddenGenres = {}; // скрытые жанры

/****************************************/
/* Шкалы */

// Горизонтальная шакала
var x = d3.scale.ordinal()
  .domain(decades.map(function (decade) {
    return decade + '\'s'; // преобразуем значения десятилетий в удобный для человека формат
  }))
  .rangePoints([0, 6 * BAR.width - 15]);

// Вертикальаня шкала
var y = d3.scale.linear()
  .range([HEIGHT, 0])
  .domain([0, d3.max(BIG_DATA, getValue)]);

/****************************************/
/* Оси */

/* Абсцисс */
var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

/* Ординат */
var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')
  .ticks(20);

/****************************************/
/*  Рисование осей и столбцов */

var chart = d3.select('svg')
  .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
  .attr('width', WIDTH + MARGIN.left + MARGIN.right);

var workspace = chart.append('g')
  .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

var yAxisElement = workspace.append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(-25, 0)')
  .call(yAxis);

yAxisElement.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 6)
  .attr('dy', '.71em')
  .attr('font-size', '12px')
  .style('text-anchor', 'end')
  .text('Percentage');

workspace.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(' + BAR.width / 2 + ',' + (HEIGHT + 10) + ')')
  .call(xAxis);

var bars = workspace.selectAll('.bar')
  .data(BIG_DATA)
    .enter().append('rect')
  .attr('class', 'bar')
  .attr('x', function (d) {
    return (BAR.width + BAR.padding) * (decades.indexOf(d.decade));
  })
  .attr('width', BAR.width)
  .attr('data-decade', getDecade)
  .attr('data-genre', getTitle)
  .attr('fill', function (d) {
    return titleColors[d.title];
  })
  .attr('y', function (d) {
    return y(d.value);
  })
  .attr('height', function (d) {
    return HEIGHT - y(d.value);
  });

/****************************************/
/* Легенда */

/* Параметры легенды */
var LEGEND = {
  paddingLeft: (((BAR.width + BAR.padding) * 6) + 90),
  width: 140,
  height: 30,
  marginBottom: 15,
  textMargin: 38
};

LEGEND.textHeight =  LEGEND.height / 2 + LEGEND.marginBottom;

var legend = chart.append('g')
    .attr('transform', 'translate(' + LEGEND.paddingLeft + ', ' + MARGIN.top + ')');

var legends = legend.selectAll('g')
  .data(genres)
  .enter().append('g')
  .attr('transform', function (d, i) {
    return 'translate(0, ' +  i * (LEGEND.height + LEGEND.marginBottom) + ')';
  });

var legendButton = legends.append('rect')
  .attr('class', 'legend-item')
  .attr('fill', getColor)
  .attr('width', LEGEND.height)
  .attr('height', LEGEND.height);

legends
  .append('svg')
.attr('height', LEGEND.textHeight)
.attr('width', LEGEND.width)
.attr('x', LEGEND.textMargin)
  .append('text')
.attr('class', 'legend')
.text(getGenre)
.attr('y', '50%')
.attr('alignment-baseline', 'middle');

var legendHideButton = legends
  .append('svg')
  .attr('height', LEGEND.textHeight)
  .attr('width', LEGEND.width)
  .attr('x', LEGEND.textMargin)
    .append('text')
  .attr('class', 'remove')
  .text('+')
  .attr('x', LEGEND.width)
  .attr('y', LEGEND.height / 2)
  .attr('dominant-baseline', 'central')
  .attr('text-anchor', 'end')
  .attr('alignment-baseline', 'middle')
  .attr('transform', rotate(-45))
  .attr('data-genre', getGenre);

/****************************************/
/* События и интерактивность */

/* События столбцов */
bars
  .on('mouseenter', onBarMouseEnter)
  .on('mouseleave', onBarMouseLeave);

/* События кнопок легенды */
legendButton.on('click', onLegendButtonClick);

/* События кнопок скрытия жанра */
legendHideButton.on('click', onLegendHideButtonClick);

/****************************************/
/* Обработчики событий */

/*
 * Обработчик события mouseenter на столбец гистограммы
 * Внутри тела функции this ссылается на элемент столбца
 *
 * 1) Показывает столбец во всю ширину
 * 2) Рисует попап над столбцом где с подробной информацией
 */
function onBarMouseEnter() {
  /* В случае, когда выбрана опция показывать только один жанр,
     сразу прекращаем обработку события */
  // if(selectedGenre){
  //   return;
  // }
  var value = this.__data__.value;
  var selection = d3.select(this);
  var decade = selection.attr('data-decade');
  var selectedHeight = Number(selection.attr('height'));
  var title = this.__data__.title;
  var titleLength = selectedGenre ? String(value).length : title.length;

  var others = d3.selectAll('.bar[data-decade="' + decade + '"]');

  others.style('display', function () {
    var bar = d3.select(this);
    var height = Number(bar.attr('height'));
    if (height < selectedHeight){
      return 'none';
    }
  });

  var popup = workspace.append('g')
    .attr('transform', 'translate(0,-60)')
    .attr('class', 'b-popup');

  /* Конфигурация параметром попапа */
  var p = (function () {
    var maxY = y(BIG_DATA.filter(function (data) {
      return data.decade === decade;
    }).reduce(function (sum, elem) {
      return elem.value > sum ? elem.value : sum;
    }, 0));

    var width = POPUP_MIN_WIDTH + (titleLength > 15 ? (titleLength - 15) * 9 : 0);
    var x = Number(selection.attr('x')) - width / 2 + BAR.width / 2;

    return {
      y: maxY,
      w: width,
      x: x
    };
  })();

  popup.append('rect')
    .attr('class', 'popup')
    .attr('x', p.x)
    .attr('y', p.y)
    .attr('width', p.w)
    .attr('height', 30);

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
    .text(!selectedGenre ? (title + '  (' + value + ')') : value);
}

/*
 * Обработчик события mouseleave на столбец гистограммы
 * Внутри тела функции this ссылается на элемент столбца
 */
function onBarMouseLeave() {
  d3.select('.b-popup').remove();
  if (!selectedGenre){
    d3.selectAll('.bar').style('display', function () {
      var bar = d3.select(this);
      var isBarHidden = hiddenGenres[bar.attr('data-genre')];
      return isBarHidden ? 'none' : 'block';
    });
  }
}

/*
 * Обработчик события mouseleave на столбец гистограммы
 * Внутри тела функции this ссылается на элемент кнопки легенды
 */
function onLegendButtonClick() {
  var genre = this.__data__.genre;
  var newSelectedGenre = null;

  d3.selectAll('.bar')
    .transition()
    .duration(230)
    .delay(100)
    .style('opacity', rangeOption('0', '1'))
    .style('display', rangeOption('none', 'block'));

  selectedGenre = newSelectedGenre;
  function rangeOption(from, to) {
    return function (d) {
      if (selectedGenre && selectedGenre === genre){
        newSelectedGenre = null;
        return to;
      }
      newSelectedGenre = genre;

      return d.title === genre ? (this.hidden ? from : to) : from;
    };
  }
}

/*
 * Обработчик события mouseleave на столбец гистограммы
 * Внутри тела функции this ссылается на элемент кнопки сокрытия жанра
 */
function onLegendHideButtonClick(d) {
  var genre = d.genre;
  var hidden = this.hidden;

  d3.select(this)
    .transition()
    .duration(100)
    .attr('transform', hidden ? rotate(-45) : rotate(0));

  d3.selectAll('.bar[data-genre="' + genre + '"]')
    .attr('display', hidden ? 'block' : 'none')
    .each(function () {
      this.hidden = hidden;
    });

  hiddenGenres[genre] = Boolean(!this.hidden);
  this.hidden = !this.hidden;
}
