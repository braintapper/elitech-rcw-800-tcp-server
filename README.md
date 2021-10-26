# Elitech RCW-800 WiFi Data Logger TCP Server

This is a TCP server example that lets you collect temperature and humidity data from an Elitech RCW-800 Wifi data logger.

The TCP server listens on port `5580` for data updates from the data logger.

To configure the RCW-800 data logger, you need to log into the web admin for the logger (http://{IP ADDRESS}) with the `admin` user (default password `admin`) and change the TCP server it talks to.

The default server is usually www.i-elitech.com. You can change this to the IP of the TCP server, or you can leave it and use a DNS override instead. The latter is probably the better option since the data logger sometimes resets its settings randomly, which means you will have to change the setting.

**This repo is meant to be forked** as it makes no assumptions about what you intend to do with the data collected.

It is up to you to implement your own action such as writing to a database, email, etc.

It is possible that other Elitech Wifi Data loggers will work with this server, but in the absence of having any of those devices, it's hard to say with any certainty.


## About the Protocol

Elitech was kind enough to not document *anything* at all, so I had to figure out what the data logger was doing when communicating to a TCP server.

The data logger sends three types of messages to the TCP server, but only one of them matters.

Sometimes duplicate messages are sent by the data logger, for whatever reason.

The message that matters is 45 characters long (as a string), or 90 characters long (as hex). The hex value is what matters.

Example of what the hex message looks like:

```
Posm   Hex  Dec    Usage
00-01  55   85     GUID Marker Start?
02-03  00   00     Device GUID Start - append everything, e.g., 000000000000255255255255
04-05  00   00 
06-07  00   00 
08-09  00   00 
10-11  00   00 
12-13  00   00 
14-15  ff   255 
16-17  ff   255 
18-19  ff   255 
20-21  ff   255    Device GUID End
22-23  55   85     GUID Marker End?
24-25  00   0 
26-27  1d   29 
28-29  68   104 
30-31  00   0 
32-33  1a   26 
34-35  00   0 
36-37  00   0 
38-39  00   0 
40-41  1d   29 
42-43  68   104 
44-45  00   0 
46-47  00   0 
48-49  00   0 
50-51  0f   15 
52-53  00   0 
54-55  16   22 
56-57  02   2 
58-59  50   80     Temperature (right of decimal)
60-61  16   22     Temperature (left of decimal) 22.8 C
62-63  03   3      Humidity % (right of decimal)
64-65  30   48     Humidity % (left of decimal) 48.3 %
66-67  00   0 
68-69  00   0 
70-71  15   21     Sensor Date Year (two digit year, boo) 21-10-26 11:49:12
72-73  0a   10     Sensor Date Month
74-75  1a   26     Sensor Date Day of Month
76-77  0b   11     Sensor Date Hour
78-79  31   49     Sensor Date Minute
80-81  0c   12     Sensor Date Seconds
82-83  48   72 
84-85  16   22 
86-87  eb   235 
88-89  45   69
```

Note that the device GUID from the device settings does not match the GUID on the sticker on the back of the device.


## Getting Started

* Clone and fork this repo
* Install dependencies
* Run the server file
* **Add your own functionality to save the readings**
* Configure your RCW-800 to send TCP data to the IP of the machine running the server file

```
git clone git@github.com:braintapper/elitech-rcw-800-tcp-server.git
npm install
node server.js
```



