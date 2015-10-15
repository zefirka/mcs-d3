var h1 = document.getElementById('header');
var ul = document.querySelector('.nav');
var lis = document.querySelectorAll('.nav li');

/*
 * Цель задания - повесить на каждый элемент списка
 * обработчик события click, так чтобы при каждом новом
 * клике элемент списка менял цвет на случайный,
 * а также менял размер шрифта на случайный в указанном диапазоне
 */

/* Возвращает (псевдо)случайное 16-ное число */
function randomHex() {
  return ((Math.random() * 257) >> 0).toString(16);
}

/* Возвращает (псевдо)случайный цвет в формате HEX */
function randomColor() {
  var R = randomHex(),
      G = randomHex(),
      B = randomHex();

  return '#' + R + G + B;
}

/* Возвращает (псевдо)случайное число в диапазоне from - to */
function randomSize(from, to) {
  to = to || from;
  from = from || 1;
  return from + (Math.random() * to >> 0);
}

/**
 * Поскольку lis (список всех элементов .nav li) - это не массив,
 * а NodeList, - похожий на массив объект предоставленный нам DOM'ом
 * то обычные методы массива (forEach, map, filter) нам недоступны
 * но мы можем вызывать методы прототипа массива в контексте списка
 * элементов, что даст одинаковый результат, как если бы NodeList,
 * обладал бы методами массива. Еще один хитрый кунштюк.
 */
[].forEach.call(lis, function (li) {
  li.addEventListener('click', function (event) {

    // на каждый элемент списка мы вешаем обработчик события click
    this.style.color = randomColor();
    this.style.fontSize = randomSize(10, 26) + 'px';
  });
});
