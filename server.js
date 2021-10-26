var Sugar, host, lastReading, net, port;

net = require('net');

Sugar = require('sugar');

Sugar.extend();

lastReading = "";

const server = net.createServer();

host = "0.0.0.0";
port = 5580;

server.listen(port, host, function() {
  return console.log("[" + (Date.create().format("%Y-%m-%d %H:%M:%S")) + "] Start listening on " + (server.address().address) + ":" + (server.address().port));
});

server.on("connection", function(sock) {
  console.log("[" + (Date.create().format("%Y-%m-%d %H:%M:%S")) + "] Connection from " + sock.remoteAddress + ":" + sock.remotePort);
  sock.on("data", function(data) {
    var guid, hex, logEntry;
    hex = data.toString('hex');
    sock.write("\r\n");
    if (hex.length === 90) {
      console.log("[" + (Date.create().format("%Y-%m-%d %H:%M:%S")) + "] " + hex);
      guid = "";
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function(o, index) {
        return guid += parseInt(hex.substr(o * 2, 2), 16).pad(2);
      });
      if (hex !== lastReading) {
        lastReading = hex;
        logEntry = {
          guid: guid,
          temperature: (parseInt(hex.substr(60, 2), 16)) + "." + (parseInt(hex.substr(58, 2), 16)),
          humidity: (parseInt(hex.substr(64, 2), 16)) + "." + (parseInt(hex.substr(62, 2), 16)),
          sensor_timestamp: "20" + (parseInt(hex.substr(70, 2), 16)) + "-" + (parseInt(hex.substr(72, 2), 16)) + "-" + (parseInt(hex.substr(74, 2), 16)) + " " + (parseInt(hex.substr(76, 2), 16)) + ":" + (parseInt(hex.substr(78, 2), 16)) + ":" + (parseInt(hex.substr(80, 2), 16)),
          server_timestamp: Date.create().format("{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}")
        };

        console.log(JSON.stringify(logEntry, null, 2));
        /* 
        TODO FOR YOU:
          Insert your own functionality here!
          
          Ideas:
          * post it to a REST API
          * send it to a webhook
          * send it as an SMS message
          * write a record to a database
          * run it as a service with PM2
          * make it a docker container
        */

      }
    }
  });
  sock.on("close", function(data) {
    return console.log("[" + (Date.create().format("%Y-%m-%d %H:%M:%S")) + "] Closed connection from " + sock.remoteAddress + ":" + sock.remotePort);
  });
  sock.on("end", function(data) {
    return console.log("[" + (Date.create().format("%Y-%m-%d %H:%M:%S")) + "] Disconnection from " + sock.remoteAddress + ":" + sock.remotePort);
  });
  sock.on("error", function(e) {
    console.log("[" + (Date.create().format("%Y-%m-%d %H:%M:%S")) + "] Error occurred");
    return console.log(e);
  });
  return sock.pipe(sock);
});

