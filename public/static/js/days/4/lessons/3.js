var CONSTANTS = {
  WIDTH: 860,
  HEIGHT: 600,
  MARGIN: {
    TOP: 20,
    LEFT: 40,
    BOTTOM: 40,
    RIGHT: 20
  },
  TICKS: 10,
  MIN: 0,
  MAX: 100
};

CONSTANTS.MAX_RADIUS = (CONSTANTS.WIDTH / CONSTANTS.HEIGHT) * 100 >> 0;
CONSTANTS.MIN_RADIUS = CONSTANTS.MAX_RADIUS - 87;

var SCALES = {
  color: 'Addiction level',
  horizontal: 'Physical disorders',
  vertical: 'Mental disorders',
  radius: 'Availibility level'
};

var URL = '/static/js/data/data.4.3.json';

/* Функция русуящая график */
function draw(data, opts) {
  /* ... */
}

