var Moscow = (function () {
  var CONSTATNS = {
    width: 960,
    height: 860,
    center: [37.656031, 55.855639],
    scale: 52000,
    regions: ['ВАО', 'ЮВАО', 'ЮАО', 'ЮЗАО', 'ЗАО', 'СЗАО', 'САО', 'СВАО', 'ЦАО']
  };

  var settings = $.extend({
    geoJSON: '/static/js/data/moscow.areas.json',
    dataUrl: '/static/js/data/moscow_wifi.csv'
  }, CONSTATNS);

  var chart;
  var projection;
  var path;
  var cache;

  function draw(map, data) {
    map.features = map.features.filter(function (feature) {
      return ~settings.regions.indexOf(feature.properties.ABBREV_AO);
    });
    cache = map;

    var districts = data.reduce(function (sum, item) {
      var d = item.District;
      if (!~sum.indexOf(d)){
        sum.push(d);
      }
      return sum;
    }, []);

    var rates = {};
    data.forEach(function (row) {
      rates[row.District] = rates[row.District] || 0;
      rates[row.District] += 1;
    });

    var arrayOfRates = o2k(rates, 'count');

    var maxRate = d3.max(arrayOfRates, prop('value'));
    var minRate = d3.min(arrayOfRates, prop('value'));
    var colorScale = d3.scale.linear()
      .range(['#7F90A3', '#004FAA'])
      .domain([minRate, maxRate]);

    svg.selectAll('.district')
      .data(map.features)
      .enter()
    .append('path')
      .attr('d', path)
      .attr('fill', function (d) {
        var name = d.properties.NAME;
        return colorScale(rates[name] || minRate);
      })
      .attr('stroke', 'black');
  }

  var api = {
    svg: d3.select('.chart'),
    geo: false,

    init: function () {
      svg = this.svg;
      this.svg
        .attr('width', settings.width)
        .attr('height', settings.height);

      projection = d3.geo.mercator()
       .center(settings.center)
       .scale(settings.scale);

      path = d3.geo.path()
        .projection(projection);

      return this;
    },

    fetch: function (geo, origins) {
      queue()
        .defer(d3.json, geo || settings.geoJSON)
        .defer(d3.csv, origins || settings.dataUrl)
        .await(function (error, map, data) {
          if (error){
            throw new Error(error);
          }

          draw(map, data);
        });

      return this;
    },

    config: function (config) {
      settings = $.extend(settings, config);
      return this;
    },

    showError: function (message) {
      message = message || 'Something went wrong';
      alert(message);
    }
  };

  return api;
})();

Moscow
  .init()
  .fetch();

