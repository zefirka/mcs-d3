function Mammal(name, legs){
	this.type = 'mammal';
	this.name = name;
	this.legs = legs;
}

Mammal.prototype.hello = function () {
	console.log('I am ' + this.type + ' ' + this.name);
}

var pet = new Mammal('Bobik', 4);

pet.hello();

function Dog(name){
	this.name = name;
}

Dog.prototype = new Mammal(null, 4);
Dog.prototype.constructor = Dog;

var myDog = new Dog('Hatiko');


