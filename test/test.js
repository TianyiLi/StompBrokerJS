const http = require("http");
const { StompService, stompConfig } = require('stomp-service')

const StompServer = require('../stompServer');

var assert = require('chai').assert;

var server = http.createServer();
var stompServer = new StompServer({ server: server, path: ['/stomp/app', '/stomp/websocket'] });
const service = new StompService()
const service2 = new StompService()

describe('StompServer', function () {

  before(async function () {
    let config1 = Object.assign({}, stompConfig)
    let config2 = Object.assign({}, stompConfig)
    config1.path = '/stomp/app'
    config1.subscribe = ['/topic/app']
    config2.subscribe = ['/queue/app']
    config1.publish = ['/queue/app']
    config2.publish = ['/topic/app']
    config2.path = '/stomp/websocket'

    service.configure(config1)
    service2.configure(config2)
    server.listen(61614);
    stompServer.start()
  });

  after(function () {
    server.close();
    service.disconnect()
    service2.disconnect()
  });

  describe('#send', function () {
    it('check msg and topic subscription', function () {
      var headers = { 'id': 'sub-0' };
      stompServer.subscribe("/**", function (msg, headers) {
        var topic = headers.destination;
        assert.equal(topic, '/data');
        assert.equal(msg, 'test body');
      }, headers);
      stompServer.send('/data', {}, 'test body');
    });
  });

  describe('#unsubscribe', function () {
    it('check topic unsubscribe', function () {
      var headers = { 'id': 'sub-0' };
      stompServer.subscribe("/**", function (msg, headers) {
        var subId = headers.subscription;
        assert.isTrue(stompServer.unsubscribe(subId), 'unsubscribe successful, subId: ' + subId);
      }, headers);
    });
  });
});
