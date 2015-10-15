function generateUser(firendLess) {
  return {
    name: {
      first: chance.first(),
      last: chance.last()
    },
    age: chance.age(),
    gender: chance.gender(),
    website: chance.domain(),
    email: chance.email(),
    friends: firendLess ? [] : [generateUser(true), generateUser(true)]
  };
}

var bigData = new Array(100).join('.').split('.').map(generateUser);
