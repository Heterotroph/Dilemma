(function() {
	if (!window.WebSocket) {
		document.body.innerHTML = "window.WebSocket?";
		return;
	}
	
	var uuid = Cookies.get('uuid');
	if (uuid) {
		document.getElementById("uuid").value = uuid;
	}
	
	var socket = new WebSocket("ws://dilemma-heterotroph.codeanyapp.com:3000");
	
	document.forms.request.onsubmit = function() {
		var request = JSON.stringify({
			"action": this.action.value,
			"data": this.data.value,
			"uuid": this.uuid.value,
			"timestamp": new Date().getTime()
		})
		socket.send(request);
		log("request: " + request);
		return false;
	};

	socket.onopen = function(event) {
		log("open; ");
	};

	socket.onclose = function(event) {
		log("close; ");
	};

	socket.onmessage = function(event) {
		var message = event.data;
		log("response: " + message);
		//
		var object = JSON.parse(message);
		if (object.action == "uuid") {
			Cookies.set("uuid", object.data);
			//document.cookie = "uuid=" + object.data + "; path=/; expires=" + Number.MAX_VALUE;
			document.getElementById("uuid").value = object.data;
		}
	};

	socket.onerror = function(event) {
		log("error; ");
	};

	function log(message) {
		var logDiv = document.getElementById("log");
		var item = document.createElement("div");
		item.appendChild(document.createTextNode(message));
		logDiv.insertBefore(item, logDiv.firstChild);
	}
})();