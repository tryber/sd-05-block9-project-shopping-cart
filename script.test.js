const createProductImageElement = require('./script');

test('make elem', () => {
  expect(createProductImageElement()).toReturn('<img>');
});
