#!/usr/bin/env node

/**
 * Module dependencies.
 */

var http = require('http');

/**
 * Set API url and station
 */

var api = "http://data.irail.be/MIVBSTIB/Departures/";
var station = "BOSSAERT-BASILIQUE";

var date = new Date();
var command = api + station + "/" + date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2) + "/" + ("0" + date.getHours()).slice(-2) + "/" + ("0" + date.getMinutes()).slice(-2) + ".json";

console.log(command);

http.request(command, function(res) {
  var body = "";

  res.on('data', function (chunk) {
    body += chunk;
  });

  res.on('end', function() {
    var timetable = JSON.parse(body);
    console.log(timetable);
    timetable.Departures.forEach(function(departure) {
      if (departure.type === '0' && departure.direction === '0') {
        var secondsLeft = parseInt((departure.time - date.getTime() / 1000));
        var minutesLeft = parseInt(secondsLeft / 60);
        secondsLeft = secondsLeft - minutesLeft * 60;
        console.log(minutesLeft + ":" + secondsLeft + " minutes left for the next tram to " + departure.long_time);
      }
    });
  });
}).on('error', function(e) {
  console.error("Got error: " + e.message);
}).end();
