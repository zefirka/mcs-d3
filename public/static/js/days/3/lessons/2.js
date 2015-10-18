var LIMIT = 20;
var PADDING = 5;
var BAR_WIDTH = 30;

/* Получаем данные */
$.ajax({
  method: 'GET',
  url: 'story.txt', // тарас бульба
  dataType: 'text',
  success: draw, // <- Вот эта функция вызывается, если все ок.
  error: alert // <- Вот эта функция вызывается, если все данные не полученны
});

/*
 * Функция, которая отрисовывает гистограмму
 * Принимает на вход текст - длинную строку :)
 */
function draw(text) {
  var words = parse(text);

  //
}
