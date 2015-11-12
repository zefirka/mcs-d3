function makePromise(method, url) {
  return new Promise(function (resolve, reject) {
    d3[method].call(d3, url, function (error, data) {
      if (error){
        reject(error);
      }
      resolve(data);
    });
  });
}
