var http = require("http");
var StompServer = require('../stompServer');

var server = http.createServer();
var server2 = http.createServer();

var stompServer = new StompServer({ server:[server, server2], debug() { console.log(arguments) } }, '/stomp').start(function (stomp) {
  stompServer = stomp
});

server.listen(61614);
server2.listen(61613)
