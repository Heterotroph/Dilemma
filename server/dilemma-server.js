const WSWorker = require("./ws-worker");
const User = require("./user");

module.exports = function() {
	
	//scoreboard
	//var dbWorker = require("./db-worker");
	//dbWorker.createConnection();
	
	var wsWorker = new WSWorker();
	wsWorker.createServer();
	
	wsWorker.on("user", function(data, ws) {
		User.create(data.uuid, ws);
	});
	
	
	
};