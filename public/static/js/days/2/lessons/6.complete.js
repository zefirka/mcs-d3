var bigData = [10, 30, 20, 50, 26];

var chart = $('.chart');

/*
 * Цель урока - написать функцию, которая принимает
 * массив чисел и визуализирует из с помощью гистограммы
 * В идеале, это функция должна быть отзывчиваой и
 * заполнять всю свободную ширину окна, т.е.
 * перестраиваться, когда размер окна меняется
 */
function draw(data) {
  data.forEach(complex);
}

draw(bigData);

/*
 * Простейшее решение - создать n столбцов и задать им
 * ширину равную величине элемента массива
 */
function naive(item) {
  var $bar = $('<div class="bar"> <span class="text">' + (item >> 0) + '</span> </div>');
  $bar.css('width', item);
  chart.append($bar);
}

/*
 * Более гибкий вариант - расчитывать необходимую ширину
 * столбца исходя из задавемых параметров (таких как ширина окна)
 */
function complex(item) {
  var widthScale = scale(0, chart.width(), 10, 50, 27.5);
  return naive(widthScale(item));
}

/* Функция, которая масштабирует ширину столбцов */
function scale(from, to, min, max, ck) {
  return function (value) {
    return ((to - from) / (max - min + ck)) * value;
  };
}

/* Создаем обработчик событий resize у окна */
$(window).on('resize', function () {
  chart.html(''); // очищаем гистограмму и рисуем снова
  bigData.forEach(complex);
});
