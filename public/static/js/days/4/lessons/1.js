d3.xml('/static/js/data/data.4.1.xml', function (error, data) {
  if (error){
    throw error;
  }
  console.log('XML Loaded successfully');
});

d3.tsv('/static/js/data/data.4.1.tsv', function (error, data) {
  if (error){
    throw error;
  }
  console.log('TSV Loaded successfully');
});

d3.json('/static/js/data/data.4.1.json', function (error, data) {
  if (error){
    throw error;
  }
  console.log('JSON Loaded successfully');
});

d3.csv('/static/js/data/data.4.1.csv', function (error, data) {
  if (error){
    throw error;
  }
  console.log('CSV Loaded successfully');
});

d3.text('/static/js/data/data.4.1.txt', function (error, data) {
  if (error){
    throw error;
  }
  console.log('.txt Loaded successfully');
});

d3.html('/', function (error, data) {
  if (error){
    throw error;
  }
  console.log('HTML Loaded successfully');
});
