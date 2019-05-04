var boot = require('../app').boot;
var shutdown = require('../app').shutdown;
var port = require('../app').port;
var superagent = require('superagent');
var expect = require('expect.js');
var seedArticles = require('../db/articles.json');


// Test server boot, shutdown & homepage GET
describe('server', function () {

  before(function () {
    boot();
  });

  describe('homepage', function () {
    // Test GET request
    it('should respond to GET', function (done) {
      superagent
        .get('http://127.0.0.1:' + port)
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
    // Test content of homepage
    it('should contain posts', function (done) {
      // GET request to homepage
      superagent
        .get('http://127.0.0.1:' + port)
        .end(function (res) {
          // Check if received response contains articles present in seedArticles
          seedArticles.forEach(function (item, index, list) {
            if (item.published) {
              expect(res.text).to.contain(
                '<h2><a href="/articles/' + item.slug + '">' + item.title
              );
            } else {
              expect(res.text).not.to.contain(
                '<h2><a href="/articles/' + item.slug + '">' + item.title
              );
            }
          });
          done();
        });
    });
  }); // End 'homepage' test suite

  describe('article page', function () {
    it('should display text', function (done) {
      var n = seedArticles.length;
      // GET request for each article
      seedArticles.forEach(function (item, index, list) {
        superagent
          .get('http://127.0.0.1:' + port + '/articles/' + seedArticles[index].slug)
          .end(function(res) {
            if (item.published) {
              expect(res.text).to.contain(
                seedArticles[index].text
              );
            } else {
              expect(res.status).to.be(401);
            }
            if (index + 1 === n) {
              done();
            }
          });
      });
    });
  }); // End 'article page' test suite

  after(function () {
    shutdown();
  });

}); // End 'server' test suite
