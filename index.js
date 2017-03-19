'use strict'

var dilemmaServer = require(process.env.SERVER_PATH + "dilemma-server");
dilemmaServer();

var staticServer = require(process.env.STATIC_PATH + "dilemma-static");
staticServer();