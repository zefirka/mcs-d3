var similiars = [];
var exceptions = [];

var words = theStory.replace(/[\.,\?\!\;\:\-«»\"\'\)\(]/g, ' ').split(/\s/);

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

function parse(text) {
  // your code goes here
}
