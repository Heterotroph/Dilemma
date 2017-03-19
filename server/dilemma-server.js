const WSWorker = require("./ws-worker");
const User = require("./user");

module.exports = function() {

	//scoreboard
	//var dbWorker = require("./db-worker");
	//dbWorker.createConnection();

	var wsWorker = new WSWorker();
	wsWorker.createServer();

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
			//можно подумать над этим местом, напрмиер, отправить uuid c undefined, да и в целом - вынести отдельно.
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
			room = Room.create();
			User.rooms.push(room);
			room.join(user);
		}
	});

};