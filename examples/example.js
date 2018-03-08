var http = require("http");
var StompServer = require('../stompServer');

var server = http.createServer();
var stompServer = new StompServer({ server: server, path:['/stomp', '/stomp/websocket'] });
stompServer.start();

server.listen(61614);

stompServer.subscribe("/**", function (msg, headers) {
  var topic = headers.destination;
  console.log(topic, "->{" + (typeof msg) + "}", msg, headers);
});