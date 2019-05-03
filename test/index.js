var boot = require('../app').boot;
var shutdown = require('../app').shutdown;
var port = require('../app').port;
var superagent = require('superagent');
var expect = require('expect.js');

describe('server', function () {
  before(function () {
    boot();
  });
  describe('homepage', function () {
    it('should respond to GET', function (done) {
      superagent
        .get('http://127.0.0.1:' + port)
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
  after(function () {
    shutdown();
  });
});
