// const assert = require('assert');
const scriptFunctionsTest = require('./script');
// const { hasUncaughtExceptionCaptureCallback } = require('process');
// const { promises } = require('fs');


const testing = (parameter) => {
  describe(`${parameter}`, () => {
    test('true assert!', () => {
      expect(typeof parameter).toBe('function');
    })();
  });
};

testing(scriptFunctionsTest);
