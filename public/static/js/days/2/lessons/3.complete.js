var similiars = [
  {reg: /^во*бщ*/, to: 'тащемта'},
  {reg: /^росси*/, to: 'Россия'},
  {reg: /^виск[иа]р?/, to: 'вискарь'},
  {reg: /^кал[$]?о*/, to: 'кал'},
  {reg: /^дирижа/, to: 'дирижабль'}
];

var exceptions = [
  /^буд[уе]т*/,
  /^котор[ыоу]*/,
  'чтобы',
  /((можн[оа])|(сможе*)|(так\-?же)|(очень)|(весьма))/
];

var words = theStory.replace(/[\.,\?\!\;\:\-«»\"\'\\(]/g, ' ').split(/\s/);

var dictionary = parse(words);

/*
 * Цель задания - реализовать функцию parse
 * которая получает на вход массив строк и
 * возвращает объект, в котором ключи - это слова,
 * а значения ключей - частота их употребления в тексте
 *
 * Идеальный вариант подразумевает, что у нас будет
 * возможность выбирать однокоренные слова, и считать их
 * за одно и то же слово. Этот механизм мы будем реализовывать
 * с помощью регулярных выражений.
 *
 * Исключения лежат в массиве exceptions, а однородные слова
 * в массиве similiars.
 */

/*****************/
/* Парсер текста */
function parse(text, limit /* = 20 */, minLength /* = 4 */) {
  limit = limit || 20;
  minLength = minLength || 4;

  var table = [];

  var dict = words
    // приводим все слова к нижнему регистру
    .map(use('toLowerCase'))
    // выбрасываем все слова короче 4 символов и которые входят в список исключений
    .filter(function (word) {
      return word.length > minLength && notInExceptions(word);
    })
    // выбираем все похожие слова, входящий в массив однородных и приводим их к единому образу
    .map(function (word) {
      // находим все совпадения в списке однородных слов
      var match = similiars.filter(function (matcher) {
        return matcher.reg.test(word);
      });

      // И если нашли такие, то приводим слово к нужному виду
      if (match.length){
        word = match[0].to;
      }

      return word;
    })
    // сворачиваем массив к объекту
    .reduce(function (sum, word) {
      sum[word] = sum[word] ? sum[word] + 1 : 1;
      return sum;
    }, {});

  // разворачиваем словарь обратно в массив, удобный для отображения
  for (var word in dict){
    table.push({
      word: word,
      count: dict[word]
    });
  }

  // сортируем таблицу по количеству вхождений
  table.sort(function (a, b) {
    return b.count - a.count;
  });

  // возвращаем первые limit элементов таблицы
  return table.slice(0, limit);
}

/*********************/
/* Функции-помощники */

// {Boolean} - входит ли слово в список исключений
function notInExceptions(word) {
  return exceptions.every(function (exeption) {
    return typeof exeption == 'string' ? word !== exeption : !exeption.test(word);
  });
}

// {Function} - создает геттер свойства объекта
function prop(name) {
  return function (data) {
    return data[name];
  };
}

// {Function} - создает функцию вызывающую метод у объекта
function use(method, args) {
  return function (data) {
    if (typeof method === 'function'){
      return method.apply(data, args || []);
    }else {
      return data[method].apply(data, args || []);
    }
  };
}
