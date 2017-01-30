var net = require('net');
var express = require('express');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

var tcpServer = net.createServer();
var app = express();

var httpPort = 1337;
var tcpPort = 5550;

//------------------------------
//---this handles the http stuff
//-----------------------------
app.get('/', function(req, res){
  res.send('hi');
});

app.listen(httpPort, function(){
  console.log('45 Park Place HTTP server listening on: ' + httpPort);
});

//------------------
// this is the TCP Server stuff
//------------------

tcpServer.on('connection', handleConnection);


tcpServer.listen(tcpPort, function(){
  console.log('TCP Service listening on: ' + tcpPort);
});

function handleConnection(conn){
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from: ' + remoteAddress);

  conn.on('data', onConnData);
  conn.once('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d){
    // console.log('connection data from %s: %j', remoteAddress, d);
    console.log(decoder.write(d));
    conn.write(d);
  }

  function onConnClose(err){
    console.log('connection from %s error: %s', remoteAddress, err.message);
  }

  function onConnError(err){
    console.log('Connection %s  error: %s', remoteAddress, err.message);
  }
}
