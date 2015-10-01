var cns = document.getElementById('console');

function code(){
	var argv = [].slice.call(arguments);

	if(cns){
		cns.innerHTML = argv.map(JSON.stringify);
	}

}