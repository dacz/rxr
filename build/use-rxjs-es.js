module.exports = function () {
  return {
    visitor: {
      ImportDeclaration(path) {
        var source = path.node.source;
        source.value = source.value.replace(/^rxjs($|\/)/, 'rxjs-es$1');
      },
    },
  };
};
