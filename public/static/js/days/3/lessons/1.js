// Выборки в D3
var firstList = d3.select('ul');
var secondList = d3.select(d3.selectAll('ul')[0].pop());

// firstList
//  .append('div')
//   .html('Новый элемент');

// secondList
//   .selectAll('span')
//     .data([0,1,2,3]).enter()
//   .append('span')
//   .style('background-color', '#eee')
//   .style('margin-right', '5px')
//   .html(function (dataItem, index) {
//     return index;
//   });

/* Задача */

// Начнем с создания заглавия:

// d3.select('body').append('h2').html('Джедаи')

// Есть массив данных о джедайах
var jedis = [
  {name: 'Оби-Ван Кеноби', color: 'blue'},
  {name: 'Йода', color: 'green'},
  {name: 'Мейс Винду', color: 'blue'},
  {name: 'Квай-Гон Джинн', color: 'green'}
];

// нужно создать в документе новый список <ul>,
// элементы которого (<li>) будут содержать в себе имена джедаев,
// а цвет текста будет цветом из светового меча (все данные есть в массиве)
