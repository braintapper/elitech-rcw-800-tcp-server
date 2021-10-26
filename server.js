var Sugar, host, lastReading, net, port;

net = require('net');

// Sugar used for formatting and other helper functions
Sugar = require('sugar');
Sugar.extend();

lastReading = ""; // use this to check for duplicate readings

const server = net.createServer();

host = "0.0.0.0"; // listening address
port = 5580; // default port
dateFormat = "%Y-%m-%d %H:%M:%S" // YYYY-MM-DD HH:MM:SS

server.listen(port, host, function() {
  console.log("[" + (Date.create().format(dateFormat)) + "] Start listening on " + (server.address().address) + ":" + (server.address().port));
});

server.on("connection", function(sock) {
  console.log("[" + (Date.create().format(dateFormat)) + "] Connection from " + sock.remoteAddress + ":" + sock.remotePort);
  sock.on("data", function(data) {
    var guid, hex, logEntry, timestamp;
    hex = data.toString('hex'); // convert data to hex
    sock.write("\r\n"); // dummy response
    if (hex.length === 90) { // when length == 90, it's a data reading
      console.log("[" + (Date.create().format(dateFormat)) + "] " + hex);
      guid = "";
      for (o = 1; o <= 10; o++) {
        guid += parseInt(hex.substr(o * 2, 2), 16).pad(2);
      };
      if (hex !== lastReading) { // skip duplicate readings
        lastReading = hex;
        timestamp = "20" + (parseInt(hex.substr(70, 2), 16)) + "-" + (parseInt(hex.substr(72, 2), 16)) + "-" + (parseInt(hex.substr(74, 2), 16)) + " " + (parseInt(hex.substr(76, 2), 16)) + ":" + (parseInt(hex.substr(78, 2), 16)) + ":" + (parseInt(hex.substr(80, 2), 16));
        logEntry = {
          guid: guid,
          reading_id: parseInt(timestamp.replaceAll(" ").replaceAll("-").replaceAll(":")), // the precision of the readings is to the second, so use timestamp as an id, note it isn't unique without the guid
          temperature: (parseInt(hex.substr(60, 2), 16)) + "." + (parseInt(hex.substr(58, 2), 16)),
          humidity: (parseInt(hex.substr(64, 2), 16)) + "." + (parseInt(hex.substr(62, 2), 16)),
          sensor_timestamp: timestamp,
          server_timestamp: Date.create().format(dateFormat)
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
    console.log("[" + (Date.create().format(dateFormat)) + "] Closed connection from " + sock.remoteAddress + ":" + sock.remotePort);
  });
  sock.on("end", function(data) {
    console.log("[" + (Date.create().format(dateFormat)) + "] Disconnection from " + sock.remoteAddress + ":" + sock.remotePort);
  });
  sock.on("error", function(e) {
    console.log("[" + (Date.create().format(dateFormat)) + "] Error occurred");
    console.log(e);
  });
  sock.pipe(sock);
});

