const http = require("http");
const { StompService, stompConfig } = require('stomp-service')

const StompServer = require('../stompServer');

var assert = require('chai').assert;

var server = http.createServer();
var stompServer = new StompServer({ server: server, path: ['/stomp/app', '/stomp/websocket'] });
const service = new StompService()
const service2 = new StompService()

describe('Stomp-Service', function () {
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
  it('stomp-service should be connected', function (done) {
    service.on('connected', function () { done() })
    service.start()
  })
  it('stomp-service should be connected', function (done) {
    service2.on('connected', function () { done() })
    service2.start()
  })
  it('send with stomp-service on different path', function (done) {
    service.on('message', msg => {
      done()
    })
    service2.emit('publish', {})
  })
})