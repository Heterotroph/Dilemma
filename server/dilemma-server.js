const WSWorker = require("./ws-worker");
const User = require("./user");
const Response = require("./response");
const Room = require("./room");
const log = require("./utils/logger.js")

module.exports = function() {
	var wsWorker = new WSWorker();
	wsWorker.createServer();
	
	var roomByUserUUID = {};

	wsWorker.on("user", function(data, ws, uuid) {
		var user = User.map[uuid];
		if (user) {
			user.ws = ws;
			//Send the client a list of his rooms (active rooms)
		} else {
			User.create(uuid, ws);
		}
	});

	wsWorker.on("join", function(data, ws, uuid) {
		var user = User.map[uuid];
		if (!user || data.uuid != uuid) {
			ws.close(1003);
			return;
		}
		var room;
		if (data.data) {
			/*room = Room.map[data.data];
			if (room && (room.state = "active" || room.state = "prepare")) {
				//room.reJoin(room);
				//joint into created
			}*/
		} else {
			do {} while (
				!(room = Room.getRoom().join(user))
			);
			roomByUserUUID[user.uuid] = room;
			log("room by user id");
			ws.send(JSON.stringify(Response.room(0, room.uuid, room.users.count())));
			if (!room.isFull) return;
			setTimeout(function() {
				room.start();
			}, 1000);
		}
	});

};