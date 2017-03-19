const EventEmitter = require('events');
const WebSocketServer = new require("ws");
const Cookie = require('cookie');

/**
 *	JSON example
 *	{
 *		"action": "super-puper-action",
 *		"data": "<action-data>",
 *		"uuid": "4a498e20-0cc3-11e7-b4ab-2f6efa1742e6",
 *		"timestamp": "1489941856"
 *	}
 */
class WSWorker extends EventEmitter {

	/**
	 *
	 */
	createServer() {
		this.allowablEvents = ["join", "step"]; //actions from client
		this.server = new WebSocketServer.Server({
			ip: process.env.WS_IP,
			port: process.env.WS_PORT
		});
		console.log(process.env.WS_PORT);
		this.onConnection();
	}

	/**
	 *
	 */
	onConnection() {
		var that = this;
		this.server.on("connection", function(ws) {

			console.log("connection");

			var uuid = processUUIDCookie(ws.upgradeReq.headers.cookie);
			console.log(uuid);

			var interval = setInterval(function() {
				ws.ping()
			}, 20000);

			that.emit("user", null, ws, uuid);

			/***/

			function processUUIDCookie(cookie) {
				var uuid;
				try {
					uuid = Cookie.parse(cookie).uuid;
				} catch (error) {}
				if (!uuid || uuid == "undefined") {
					uuid = require("node-uuid").v1();
					var response = JSON.stringify({
						"action": "uuid",
						"data": uuid,
						"timestamp": new Date().getTime()
					})
					ws.send(response);
					console.log("send: " + response);
				}
				return uuid;
			}

			function processMessage(message) {
				var data;
				try {
					data = JSON.parse(message);
					if (that.allowablEvents.indexOf(data.action) == -1) return null;
					that.emit(data.action, data, ws, uuid);
				} catch (error) {
					return null;
				}
				return data.action;
			}

			ws.on("message", function(message) {
				console.log("message: " + message);
				processMessage(message);
			});

			ws.on("close", function(code, reason) {
				console.log("close: " + code + "; " + reason);
				clearInterval(interval);
			});

			ws.on("error", function(error) {
				console.log("error: " + error);
				clearInterval(interval);
				ws.close(1011);
			});

		});
	}

}

module.exports = WSWorker;