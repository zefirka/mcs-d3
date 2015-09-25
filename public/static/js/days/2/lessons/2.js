// var h1 = document.getElementById('header');
// var ul = document.querySelector('.nav');

// var lis = document.querySelectorAll('.nav li');

// function randomHue(){
// 	return ((Math.random() * 257) >> 0).toString(16);
// }

// function randomColor(){
// 	var R = randomHue(),
// 		G = randomHue(),
// 		B = randomHue();

// 	return '#' + R + G + B;
// }

// function randomSize(from, to){
// 	to = to || from;
// 	from = from || 1;
// 	return from + (Math.random() * to >> 0);
// }

// [].forEach.call(lis, function (li) {
// 	li.addEventListener('click', function(event){
// 		this.style.color = randomColor();
// 		this.style.fontSize = randomSize(10, 26) + 'px';
// 	});
// });