var http = require("http");
var StompServer = require('../stompServer');

var assert = require('chai').assert;


var server = http.createServer();
var stompServer = new StompServer({server: server});

describe('StompServer', function() {

  before(function() {
    server.listen(61614);
  });

  after(function() {
    server.close();
  });

  describe('#send', function() {
    it('check msg and topic subscription', function() {
      var headers = {'id': 'sub-0'};
      stompServer.subscribe("/**", function(msg, headers) {
        var topic = headers.destination;
        assert.equal(topic, '/data');
        assert.equal(msg, 'test body');
      }, headers);
      stompServer.send('/data', {}, 'test body');
    });
  });

  describe('#unsubscribe', function() {
    it('check topic unsubscribe', function() {
      var headers = {'id': 'sub-0'};
      stompServer.subscribe("/**", function(msg, headers) {
        var subId = headers.subscription;
        assert.isTrue(stompServer.unsubscribe(subId), 'unsubscribe successfull, subId: ' + subId);
      }, headers);
    });
  });
});
