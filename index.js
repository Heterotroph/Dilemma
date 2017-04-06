'use strict'

var staticServer = require(process.env.STATIC_PATH + "dilemma-static");
staticServer();

var dilemmaServer = require(process.env.SERVER_PATH + "dilemma-server");
dilemmaServer();