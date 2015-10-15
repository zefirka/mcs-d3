// var bigData = [10, 30, 20, 50, 26];

// var chart = $('.chart');

// // naive

// function naive(item){
//  var $bar = $('<div class="bar"></div>');
//  $bar.css('width', item);
//  chart.append($bar);
// }

// function complex(item){
//  function scale(from, to, min, max, ck){
//      return function(value){
//          return ((to - from) / (max - min + ck)) * value;
//      }
//  }

//  var width = scale(0, chart.width(), 10, 50, 27.5)

//  return naive(width(item));
// }

// bigData.forEach(complex);

// $(window).resize(function(){
//  chart.html('');
//  bigData.forEach(complex);
// })
