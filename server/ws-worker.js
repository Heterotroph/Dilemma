const EventEmitter = require('events');
const WebSocketServer = new require("ws");

module.exports = class WSWorker extends EventEmitter {
	
	/**
	 *
	 *
	 */
	createServer() {
		console.log("WSWorker#createServer");

		this.allowablEvents = ["uuid", "join", "play", "empty"];
		this.server = new WebSocketServer.Server({
			ip: process.env.WS_IP,
			port: process.env.WS_PORT
		});
		this.onConnection();
	}

	/**
	 *
	 *
	 */
	onConnection() {
		var that = this;
		this.server.on("connection", function(ws) {
			console.log("WSWorker#connection");

			var interval = setInterval(function() {
				ws.ping()
			}, 20000);
			var timeout = setTimeout(function() {
				ws.close(1003)
			}, 10000);
			var clientID = "no_defined";

			ws.on("message", function(message) {
				console.log("WSWorker#message#" + clientID + ": " + message);
				that.processMessage(message, ws);
			});

			ws.on("close", function(code, reason) {
				console.log("WSWorker#close#" + clientID + ": " + code + "; " + reason);
				clearInterval(interval);
			});

			ws.on("error", function(error) {
				console.log("WSWorker#error#" + clientID + ": " + error);
			})

			that.on("uuid", function(data, ws) {
				console.log("WSWorker#uuid#" + clientID);
				clearTimeout(timeout);
				if (data.uuid == clientID) {
					clientID = require("node-uuid").v1();
					var response = JSON.stringify({
						"action": "uuid",
						"data": clientID,
						"timestamp": new Date().getTime()
					})
					ws.send(response);
					console.log("WSWorker#uuid#send: " + response);
				}
			});
			
		});
	}

	/**
	 *	{
	 *		"action": "super-puper-action",
	 *		"data": "<action-data>",
	 *		"uuid": "4a498e20-0cc3-11e7-b4ab-2f6efa1742e6",
	 *		"timestamp": "1489941856"
	 *	}
	 */
	processMessage(message, ws) {
		var data = JSON.parse(message);
		if (this.allowablEvents.indexOf(data.action) == -1) {
			this.emit("empty", data, ws);
			return "empty";
		}
		this.emit(data.action, data, ws);
		return data.action;
	}

};