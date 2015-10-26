'use strict';

var fs = require('fs');
var pkg = require('../package.json');

var frontendDependecies = pkg.frontend.map(function(x){
	return 'node_modules/' + x; 
}).join('\n') + '\n';

fs.writeFile('deps', frontendDependecies, {encoding : 'utf-8'}, function(err){
  if(err){
    throw err;
  }
});
