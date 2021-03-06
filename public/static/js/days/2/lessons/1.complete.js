/**
  * Task: Вывести самого старого и самого молодого пользователя
  */

/* Мучительный вариант */
var oldestUser = {age: 0};
var youngestUser = null;

for (var i = 0, l = bigData.length; i < l; i++){
  var user = bigData[i];

  if (!youngestUser){
    youngestUser = user;
  }

  if (!oldestUser){
    oldestUser = user;
  }

  if (user.age > oldestUser.age){
    oldest = user;
  }

  if (user.age < youngestUser.age){
    youngestUser = user;
  }
}

/* ТруЪ-функциональный вариант */
function more(a, b) {
  return a > b;
}

function less(a, b) {
  return a < b;
}

function reduceBy(prop, oper) {
  return function (sum, iter) {
    return oper(iter[prop], sum[prop]) ? iter : sum;
  };
}

var oldestUser = bigData.reduce(reduceBy('age', more));
var youngestUser = bigData.reduce(reduceBy('age', less));

/** Посчитать количество тезок и/или однофамильцев **/
/**** Тезки ****/
var names = {
  first: {},
  last: {}
};
var namesakes = {
  first: {},
  last: {}
};

bigData.forEach(function (user) {
  var fname = user.name.first;
  var lname = user.name.last;

  names.first[fname] = !names.first[fname] ? 1 : 2;
  names.last[lname] = !names.last[lname] ? 1 : 2;

  if (names.first[fname] > 1){
    namesakes.first[fname] = namesakes.first[fname] || 1;
    namesakes.first[fname] += 1;
  }

  if (names.last[lname] > 1){
    namesakes.last[lname] = namesakes.last[lname] || 1;
    namesakes.last[lname] += 1;
  }
});

/**
 * Посчитать отношение количества мужчин и женщин
 */
/* Обычный вариант */
var women = 0;
var men = 0;
for (var i = 0, l = bigData.length; i < l; i++){
  if (bigData[i].gender == 'Male'){
    men++;
  }else {
    women++;
  }
}

var value = men / women;

/* Функциональный вариант */
function propEq(prop, value) {
  return function (data) {
    return data[prop] === value;
  };
}

var women = bigData.filter(propEq('gender', 'Female')).length;
var men = bigData.filter(propEq('gender', 'Male')).length;
var value = men / women;

/* Посчитать количество людей в имени которых больше n букв */

function countNLettersInName(n, type) {
  return bigData.filter(function (user) {
    return user.name[type || 'first'].length > n;
  }).length;
}

/* Есть ли кто-нибудь у кого в имену больше 4-х согласных подряд */
function cons(x) {
  var CONSONANTS = 'qwrtpsdfghjklzxcvbnm';

  var result = bigData.filter(function (user) {
    var name = user.fullName().toLowerCase();
    var conses = 0;

    [].reduce.call(name, function (sum, letter) {
      var isLetterConsonant = ~CONSONANTS.indexOf(letter);
      if (isLetterConsonant){
        sum++;
        if (conses <= sum){
          conses = sum;
        }
      } else {
        sum = 0;
      }
      return sum;
    }, 0);

    return conses >= x;
  });

  return result[0] ? result[0].fullName() : false;
}
