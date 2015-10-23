function generateUser(firendLess) {
  return {
    name: {
      first: chance.first(),
      last: chance.last()
    },
    fullName: function(){
      return this.name.first + ' ' + this.name.last;
    },
    age: chance.age(),
    gender: chance.gender(),
    website: chance.domain(),
    address: {
      city: chance.city(),
      street: chance.street()
    },
    email: chance.email(),
    twitter: chance.twitter(),
    friends: firendLess ? [] : [generateUser(true), generateUser(true)]
  };
}

var bigData = new Array(500).join('.').split('.').map(generateUser);