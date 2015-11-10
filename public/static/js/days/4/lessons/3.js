/********************************************************/
/* Константы и настройки */

var CONSTANTS = {
  WIDTH: 860,
  HEIGHT: 640,
  MARGIN: {
    TOP: 20,
    LEFT: 50,
    BOTTOM: 120,
    RIGHT: 20
  },
  TICKS: 10,
  MIN: 0,
  MAX: 100,
  RADIUS_RANGE: [10, 60]
};

var SCALES = {
  color: 'Addiction level',
  horizontal: 'Physical disorders',
  vertical: 'Mental disorders',
  radius: 'Availibility level'
};

d3.json('/static/js/data/data.4.3.json', function (error, json) {

  json = Object.keys(json).map(function (key) {
    return merge({
      name: key
    }, json[key]);
  });

  draw(json, merge(CONSTANTS, SCALES));
});

function draw() {

}
