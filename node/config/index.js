function config(locale) {
  function rooty(path) {
    return __dirname + '/../../' + path;
  }

  return {
    title: 'Визуализация данных с помощью D3.js',
    root: rooty(''),
    public: rooty('public'),
    views: rooty('public/view'),
    static: 'static',
    port: 8080,

    dev: {
      logTime: {
        repl: true,
        file: false,
      },
      logMorgan: {
        repl: false,
        file: true
      }
    }
  };
}

module.exports = config();
