const EventEmitter = require("events");
const WebSocketServer = new require("ws");
const Cookie = require("cookie");
const Response = require("./response");
const NodeUUID = require("node-uuid");
const log = require("./utils/logger.js")

/**
 *	JSON request example
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
		log(process.env.WS_PORT);
		this.onConnection();
	}

	/**
	 *
	 */
	onConnection() {
		var that = this;
		this.server.on("connection", function(ws) {
			var uuid = processUUIDCookie(ws.upgradeReq.headers.cookie);
			log("connection: " + uuid, true);

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
					uuid = NodeUUID.v1();
					var response = JSON.stringify(Response.uuid(uuid));
					ws.send(response);
					log("send: " + response);
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
				log("message: " + message + "; uuid: " + uuid, true);
				processMessage(message);
			});

			ws.on("close", function(code, reason) {
				log("close: " + code + "; uuid: " + uuid + "; reason: " + reason, true);
				clearInterval(interval);
			});

			ws.on("error", function(error) {
				log("error: " + error + "; uuid: " + uuid, true);
				clearInterval(interval);
				ws.close(1011);
			});

		});
	}

}

module.exports = WSWorker;