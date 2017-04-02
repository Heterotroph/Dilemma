'use strict'

console.log(new Date().getTime());

var staticServer = require(process.env.STATIC_PATH + "dilemma-static");
staticServer();

var dilemmaServer = require(process.env.SERVER_PATH + "dilemma-server");
dilemmaServer();

