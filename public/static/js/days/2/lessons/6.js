// var bigData = [10, 30, 20, 50, 26];

// var container = $('.container');

// // naive

// function naive(item){
// 	var $bar = $('<div class="bar"></div>');
// 	$bar.css('width', item);
// 	container.append($bar);
// }



// function complex(item){
// 	function scale(from, to, min, max, ck){
// 		return function(value){
// 			return ((to - from) / (max - min + ck)) * value;
// 		}
// 	}

// 	var width = scale(0, container.width(), 10, 50, 27.5)

// 	return naive(width(item));
// }

// bigData.forEach(complex);

// $(window).resize(function(){
// 	container.html('');
// 	bigData.forEach(complex);
// })