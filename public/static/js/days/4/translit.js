var Translit = (function () {
  var arrru = new Array ('Я','я','Ю','ю','Ч','ч','Ш','ш','Щ','щ','Ж','ж','А',
    'а','Б','б','В','в','Г','г','Д','д','Е','е','Ё','ё','З','з','И','и','Й',
    'й','К','к','Л','л','М','м','Н','н', 'О','о','П','п','Р','р','С','с','Т',
    'т','У','у','Ф','ф','Х','х','Ц','ц','Ы','ы','Ь','ь','Ъ','ъ','Э','э');
  var arren = new Array ('Ya','ya','Yu','yu','Ch','ch','Sh','sh','Sh','sh',
    'Zh','zh','A','a','B','b','V','v','G','g','D','d','E','e','E','e','Z',
    'z','I','i','J','j','K','k','L','l','M','m','N','n', 'O','o','P','p','R',
    'r','S','s','T','t','U','u','F','f','H','h','C','c','Y','y','`','`','\'','\'','E', 'e');

  function cyrill_to_latin(text) {
    for (var i = 0; i < arrru.length; i++){
      var reg = new RegExp(arrru[i], 'g');
      text = text.replace(reg, arren[i]);
    }
    return text;
  }

  function latin_to_cyrill(text) {
    for (var i = 0; i < arren.length; i++){
      var reg = new RegExp(arren[i], 'g');
      text = text.replace(reg, arrru[i]);
    }
    return text;
  }
  return function (text, p) {
    return !Boolean(p) ? cyrill_to_latin(text) : latin_to_cyrill(text);
  };
})();

