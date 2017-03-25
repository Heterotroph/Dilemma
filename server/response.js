const Response = {};

Response.create = function(action, ...args) {
	return Response[action](args);
}

Response.uuid = function(uuid) {
	return {
		"action": "uuid",
		"data": uuid,
		"timestamp": new Date().getTime()
	}
}

Response.start = function(uuid) {
	return {
		"action": "start",
		"data": uuid,
		"timestamp": new Date().getTime()
	}
}

Response.room = function(uuid) {
	return {
		"action": "room",
		"data": uuid,
		"timestamp": new Date().getTime()
	}
}

module.exports = Response;