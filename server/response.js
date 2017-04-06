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

Response.room = function(status, uuid, currentPlayersCount, maxPlayersCount) {
	return {
		"action": "room",
		"data": {
			"status": status,
			"room-uuid": uuid,
			"players": {
				"currentCount": currentPlayersCount,
				"maxCount": maxPlayersCount
			}
		},
		"timestamp": new Date().getTime()
	}
}

Response.step = function(currentStep, stepData) {
	return {
		"action": "room",
		"data": {
			"currentStep": currentStep,
			"stepData": stepData
		},
		"timestamp": new Date().getTime()
	}
}

module.exports = Response;