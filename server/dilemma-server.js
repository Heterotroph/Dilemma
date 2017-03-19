module.exports = function() {

	//var dbWorker = require("./db-worker");
	//dbWorker.createConnection();
	
	var WSWorker = require("./ws-worker");
	var wsWorket = new WSWorker();
	wsWorket.createServer();
	
};