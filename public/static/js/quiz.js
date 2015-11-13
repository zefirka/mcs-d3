'use strict';

var PP = ['title'];

$.fn.interpolate = function (data) {
  var html = this.html();
  var nhtml = interpolate(html, data);
  if (html !== nhtml){
    this.html(nhtml);
  }
  return nhtml;
};

var Q = (function () {
  var converter = new showdown.Converter();
  function m2h(mkd) {
    return converter.makeHtml(mkd);
  }

  function template(id, data) {
    return interpolate($('#' + id).html(), data);
  }

  function ask(data, t) {
    let tpl = 'ask';

    if (data.code){
      tpl = 'ask_code';
      data.code = data.code[0] === '#' ? template(data.code.slice(1)) : data.code;
    }
    return m2h(template(tpl, data));
  }

  function list(l) {
    var x = l.map(i => m2h(i)).map(x => `<li class="b-card__select">${x}</li>`);
    return `<ul>${x.join('')}</ul>`;
  }

  function card(item) {
    PP.forEach(p => {
      item[p] = m2h(item[p]);
    });

    return template('card', item);
  }

  function script() {

  }

  function quiz(bd, scripts) {
    document.body.innerHTML = bd.map(card);
    document.body.innerHTML += (scripts || []).map(script);
  }

  quiz.ask = ask;
  quiz.list = list;
  quiz.md = m2h;
  quiz.body = function () {
    return [].slice.call(arguments).join('\n');
  };
  //quiz.button = button;

  return quiz;

})();
