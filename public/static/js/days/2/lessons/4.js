var cns = document.getElementById('console');

function code(source) {
  var str = source.toString();

  if (typeof source === 'object'){
    str = JSON.stringify(source);
  }

  if (cns){
    cns.innerHTML = str;
  }

}
