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

/* ТруЪ вариант */
var oldestUser = bigData.reduce(function (oldest, user) {
  return user.age > oldest.age ? user : oldest;
});

var youngestUser = bigData.reduce(function (youngest, user) {
  return user.age < youngest.age ? user : youngest;
});

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

/* Отношение полов */
function propEq(prop, value) {
  return function (data) {
    return data[prop] === value;
  };
}

var women = bigData.filter(propEq('gender', 'Female')).length;
var men = bigData.filter(propEq('gender', 'Male')).length;
var value = men / women;

/* Length */
function countNLettersInName(n, type) {
  return bigData.filter(function (user) {
    return user.name[type || 'first'].length > n;
  }).length;
}
