var cache = (function () {
  var store;
  return {
    cached: false,
    get: function () {
      return store;
    },
    set: function (x) {
      store = x;

      if (x === undefined){
        this.cached = false;
      } else {
        this.cached = true;
      }
    }
  };
})();

var $limit = $('#limit');
$limit.on('change', function () {
  draw(null, Number(this.value));
});

$.ajax({
  method: 'GET',
  url: 'story.txt',
  dataType: 'text',
  success: function (text) {
    draw(text, $limit.val());
  },
  error: function (error) {
    alert('error');
  }
});

function notInExceptions(word) {
  return exeptions.every(function (exeption) {
    return typeof exeption == 'string' ? word !== exeption : !exeption.test(word);
  });
}

function parse(text, limit) {
  var table = [];

  if (!cache.cached){
    var words = text.replace(/[\.,\?\!\;\:\-«»\"\'\\(]/g, ' ').split(/\s/);
    var dict = words.map(function (word) {
      return word.toLowerCase();
    }).filter(function (word) {
      return word.length > 4 && notInExceptions(word);
    }).map(function (word) {
      var match = equals.filter(function (matcher) {
        return matcher.reg.test(word);
      });

      if (match.length){
        word = match[0].to;
      }

      return word;
    })
    .reduce(function (sum, word) {
      if (sum[word]){
        sum[word] += 1;
      } else {
        sum[word] = 1;
      }
      return sum;
    }, {});

    for (var word in dict){
      table.push({
        word: word,
        count: dict[word]
      });
    }

    table.sort(function (a, b) {
      return b.count - a.count;
    });

    cache.set(table);
  }else {
    table = cache.get();
  }

  return table.slice(0, limit);
}

var PADDING = 5;
function draw(text, limit) {
  var words = parse(text, limit);

  d3.select('.chart').html('');

  var svg = d3.select('.chart')
  .attr('height', words.length * (30 + PADDING));

  var bar = svg
  .selectAll('g')
      .data(words)
    .enter().append('g')
      .attr('transform', function (d, i) {
        return 'translate(0,' + i * (30 + PADDING) + ')';
      });

  bar.append('rect')
    .attr('width', function (d) {
      return d.count + 'px';
    })
    .attr('height', 30);

  bar.append('text')
    .attr('x', function (d) {
      return (d.count + 10) + 'px';
    })
    .attr('y', 30 / 2)
    .attr('dy', '.35em')
    .text(function (d) {
    return d.word + ' (' + d.count + ')';
  });
}
