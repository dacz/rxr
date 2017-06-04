module.exports = {
  extends: "dacz",
  rules: {
    'no-param-reassign': 0,
    'no-multiple-empty-lines': 0,
    'no-warning-comments': [
      2,
      {
        'terms': ['todo', 'fixme'],
        'location': 'anywhere'
      }
    ]
  }
};
